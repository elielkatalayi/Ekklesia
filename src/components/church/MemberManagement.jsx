import React, { useState, useEffect } from 'react';
import { Search, User, Shield, Trash2, X, Loader2 } from 'lucide-react';
import userApi from '../../api/user.api';
import toast from 'react-hot-toast';
import { USER_ROLES } from '../../utils/constants';

const MemberManagement = ({ churchId, onClose, onUpdate }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [newRole, setNewRole] = useState('');

  const roleLabels = {
    [USER_ROLES.PASTOR]: '👑 Pasteur',
    [USER_ROLES.MODERATOR]: '⚙️ Modérateur',
    [USER_ROLES.DEACON]: '🙏 Diacre',
    [USER_ROLES.MEMBER]: '👤 Membre',
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getUsers({ search });
      if (response.data.success) {
        setMembers(response.data.data.users || []);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des membres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, role) => {
    if (!role) {
      toast.error('Veuillez sélectionner un rôle');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userApi.updateRole(userId, { role });
      if (response.data.success) {
        toast.success('Rôle mis à jour');
        setSelectedMember(null);
        loadMembers();
        onUpdate();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rôle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Voulez-vous vraiment retirer ce membre de l\'église ?')) return;

    setIsLoading(true);
    try {
      const response = await userApi.removeUser(userId);
      if (response.data.success) {
        toast.success('Membre retiré');
        loadMembers();
        onUpdate();
      }
    } catch (error) {
      toast.error('Erreur lors du retrait du membre');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case USER_ROLES.PASTOR: return 'role-pastor';
      case USER_ROLES.MODERATOR: return 'role-moderator';
      case USER_ROLES.DEACON: return 'role-deacon';
      default: return 'role-member';
    }
  };

  return (
    <div className="member-management">
      <div className="management-header">
        <h2>👥 Gestion des membres</h2>
        <button className="close-btn" onClick={onClose}>
          <X className="icon" />
        </button>
      </div>

      <div className="management-search">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="search-input"
          />
        </div>
        <button className="search-btn" onClick={loadMembers}>
          Rechercher
        </button>
      </div>

      {isLoading ? (
        <div className="management-loading">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      ) : (
        <div className="members-management-list">
          {members.length === 0 ? (
            <div className="members-empty">
              <User className="icon large" />
              <p>Aucun membre trouvé</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="management-member-card">
                <div className="member-info">
                  <div className="member-avatar-small">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} />
                    ) : (
                      <div className="avatar-placeholder-small">
                        {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="member-name">{member.name || 'Anonyme'}</h4>
                    <span className={`member-role-small ${getRoleColor(member.role)}`}>
                      {roleLabels[member.role] || member.role}
                    </span>
                  </div>
                </div>

                <div className="member-actions">
                  {member.role !== USER_ROLES.PASTOR && (
                    <>
                      <select
                        value={selectedMember === member.id ? newRole : ''}
                        onChange={(e) => {
                          setSelectedMember(member.id);
                          setNewRole(e.target.value);
                        }}
                        className="role-select"
                      >
                        <option value="">Changer rôle</option>
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      {selectedMember === member.id && newRole && (
                        <button
                          className="save-role-btn"
                          onClick={() => handleRoleUpdate(member.id, newRole)}
                        >
                          <Shield className="icon" />
                        </button>
                      )}
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveMember(member.id)}
                        title="Retirer de l'église"
                      >
                        <Trash2 className="icon" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MemberManagement;