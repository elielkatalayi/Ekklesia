import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Calendar, UserCog, ChevronLeft, ChevronRight } from 'lucide-react';
import churchApi from '../../api/church.api';
import { formatDate } from '../../utils/formatters';
import { USER_ROLES } from '../../utils/constants';

const MembersList = ({ churchId, canManage, onManageMember }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const roleLabels = {
    [USER_ROLES.PASTOR]: '👑 Pasteur',
    [USER_ROLES.MODERATOR]: '⚙️ Modérateur',
    [USER_ROLES.DEACON]: '🙏 Diacre',
    [USER_ROLES.MEMBER]: '👤 Membre',
  };

  useEffect(() => {
    loadMembers();
  }, [pagination.page, roleFilter]);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (roleFilter) params.role = roleFilter;
      
      const response = await churchApi.getMembers(churchId, params);
      if (response.data.success) {
        setMembers(response.data.data.members || []);
        setPagination(response.data.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      }
    } catch (error) {
      console.error('Erreur chargement membres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadMembers();
  };

  const getRoleDisplay = (role) => {
    return roleLabels[role] || role;
  };

  const getRoleColor = (role) => {
    switch(role) {
      case USER_ROLES.PASTOR: return 'role-pastor';
      case USER_ROLES.MODERATOR: return 'role-moderator';
      case USER_ROLES.DEACON: return 'role-deacon';
      default: return 'role-member';
    }
  };

  if (isLoading) {
    return (
      <div className="members-loading">
        <div className="spinner"></div>
        <p>Chargement des membres...</p>
      </div>
    );
  }

  return (
    <div className="members-list">
      <div className="members-header">
        <h3>👥 Membres de l'église</h3>
        {canManage && (
          <button className="btn btn-primary" onClick={onManageMember}>
            <UserCog className="icon" /> Gérer les membres
          </button>
        )}
      </div>

      {/* Filtres */}
      <form onSubmit={handleSearch} className="members-filters">
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
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les rôles</option>
          {Object.entries(roleLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="search-btn">Rechercher</button>
      </form>

      {/* Liste */}
      <div className="members-grid">
        {members.length === 0 ? (
          <div className="members-empty">
            <User className="icon large" />
            <p>Aucun membre trouvé</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div className="member-info">
                <h4 className="member-name">{member.name || 'Anonyme'}</h4>
                <span className={`member-role ${getRoleColor(member.role)}`}>
                  {getRoleDisplay(member.role)}
                </span>
                {member.email && (
                  <p className="member-email">
                    <Mail className="icon" /> {member.email}
                  </p>
                )}
                {member.phone && (
                  <p className="member-phone">
                    <Phone className="icon" /> {member.phone}
                  </p>
                )}
                <p className="member-joined">
                  <Calendar className="icon" /> Inscrit le {formatDate(member.createdAt)}
                </p>
                {member.lastLogin && (
                  <p className="member-last-login">
                    Dernière connexion: {formatDate(member.lastLogin)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            <ChevronLeft className="icon" />
          </button>
          <span className="pagination-info">
            Page {pagination.page} sur {pagination.totalPages}
            <span className="pagination-total">
              ({pagination.total} membres)
            </span>
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className="pagination-btn"
          >
            <ChevronRight className="icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MembersList;