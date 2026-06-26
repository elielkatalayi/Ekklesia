// components/services/index.js

export { default as ServiceList } from './ServiceList';
export { default as ServiceCard } from './ServiceCard';
export { default as ServiceBuilder } from './ServiceBuilder';
export { default as ServiceOrder } from './ServiceOrder';
export { default as OrderForm } from './OrderForm';
export { default as OrderEditForm } from './OrderEditForm';
export { default as VerseSelector } from './VerseSelector';
export { BIBLE_BOOKS } from './BIBLE_BOOKS';
export { ITEM_TYPES, VISIBILITY_OPTIONS } from './constants';














// components/services/
// ├── index.js                 # Export centralisé
// ├── BIBLE_BOOKS.js          # Liste des livres
// ├── constants.js            # ITEM_TYPES, VISIBILITY_OPTIONS
// ├── ServiceOrder.jsx        # Composant principal
// ├── OrderForm.jsx           # Formulaire d'ajout
// ├── OrderEditForm.jsx       # Formulaire d'édition
// ├── VerseSelector.jsx       # Sélecteur de versets
// ├── ServiceList.jsx         # Liste des services
// ├── ServiceCard.jsx         # Carte d'un service
// └── ServiceBuilder.jsx      # Création d'un service