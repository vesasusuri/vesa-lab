import React, { useMemo, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import SectionShell from './homeSections/SectionShell';
import { patchSectionItems } from './homeSections/patchSectionItems';
import {
  ImageSectionFields,
  CategoriesFields,
  CompaniesFields,
  FindJobFields,
  TestimonialsFields,
  FooterFields,
  AboutStatsFields,
  AboutOverviewFields,
} from './homeSections/HomeSectionEditorBlocks';

const GROUPS = [
  {
    id: 'hero',
    title: 'Banner & trusted by',
    subtitle: 'Hero avatars and partner logo strip.',
    keys: ['banner', 'trusted_by'],
  },
  {
    id: 'categories',
    title: 'Categories',
    subtitle: 'Tiles on the home page category grid.',
    keys: ['categories'],
  },
  {
    id: 'companies',
    title: 'Company cards',
    subtitle: 'Featured employers on the home page.',
    keys: ['companies_cards'],
  },
  {
    id: 'find-job',
    title: 'Find job',
    subtitle: 'Mid-page call-to-action block.',
    keys: ['find_job'],
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    subtitle: 'Quotes carousel.',
    keys: ['testimonials'],
  },
  {
    id: 'footer',
    title: 'Footer',
    subtitle: 'Contact line, social icons, and link columns.',
    keys: ['footer'],
  },
];

const AdminHomeSectionsPanel = ({
  homeSectionsForm,
  setHomeSectionsForm,
  persistHomeSections,
  uploadHomeSectionImage,
  createHomeSectionItem,
  deleteHomeSectionItem,
  groups = GROUPS,
  heading = 'Home page sections',
  description = 'Edit by area below. Save writes everything to the database. Add / Remove runs immediately.',
}) => {
  const [uploadingKey, setUploadingKey] = useState('');
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id);
  const activeGroup = groups.find((group) => group.id === activeGroupId) || groups[0];

  const byKey = useMemo(() => {
    const map = {};
    (homeSectionsForm || []).forEach((s) => { map[s.key] = s; });
    return map;
  }, [homeSectionsForm]);

  const updateSectionTitle = (sectionKey, value) => {
    setHomeSectionsForm((current) => current.map((s) => (s.key === sectionKey ? { ...s, title: value } : s)));
  };

  const updateItemField = (sectionKey, itemIndex, field, value) => {
    setHomeSectionsForm((current) => patchSectionItems(current, sectionKey, (items) => items.map((item, idx) => (
      idx === itemIndex ? { ...item, [field]: value } : item
    ))));
  };

  const updateItemMetadata = (sectionKey, itemIndex, metaPatch) => {
    setHomeSectionsForm((current) => patchSectionItems(current, sectionKey, (items) => items.map((item, idx) => (
      idx === itemIndex
        ? { ...item, metadata: { ...(item.metadata || {}), ...metaPatch } }
        : item
    ))));
  };

  const onUploadImage = async (e, sectionKey, itemIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${sectionKey}-${itemIndex}`;
    setUploadingKey(key);
    const url = await uploadHomeSectionImage(file, sectionKey);
    if (url) updateItemField(sectionKey, itemIndex, 'imageUrl', url);
    setUploadingKey('');
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    const ok = await persistHomeSections(homeSectionsForm);
    if (ok) window.alert('Home sections saved successfully.');
    else window.alert('Unable to save home sections. Please try again.');
  };

  const onAddItem = async (sectionKey, defaults) => {
    const created = await createHomeSectionItem(sectionKey, defaults);
    if (created) window.alert('Item added.');
    else window.alert('Could not add item.');
  };

  const onDeleteItem = async (item) => {
    if (!item?.id) return;
    if (!window.confirm('Delete this item?')) return;
    const ok = await deleteHomeSectionItem(item.id);
    if (!ok) window.alert('Could not delete item.');
  };

  const renderFieldsForKey = (key) => {
    const section = byKey[key];
    if (!section) return null;

    if (key === 'banner' || key === 'trusted_by') {
      return (
        <ImageSectionFields
          key={key}
          section={section}
          updateSectionTitle={updateSectionTitle}
          updateItemField={updateItemField}
          onUploadImage={onUploadImage}
          uploadingKey={uploadingKey}
        />
      );
    }
    if (key === 'categories') {
      return (
        <CategoriesFields
          key={key}
          section={section}
          updateSectionTitle={updateSectionTitle}
          updateItemField={updateItemField}
          updateItemMetadata={updateItemMetadata}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
        />
      );
    }
    if (key === 'companies_cards') {
      return (
        <CompaniesFields
          key={key}
          section={section}
          updateItemField={updateItemField}
          updateItemMetadata={updateItemMetadata}
          onUploadImage={onUploadImage}
          uploadingKey={uploadingKey}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
        />
      );
    }
    if (key === 'find_job') {
      return (
        <FindJobFields
          key={key}
          section={section}
          updateItemField={updateItemField}
          updateItemMetadata={updateItemMetadata}
        />
      );
    }
    if (key === 'testimonials') {
      return (
        <TestimonialsFields
          key={key}
          section={section}
          updateSectionTitle={updateSectionTitle}
          updateItemField={updateItemField}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
        />
      );
    }
    if (key === 'footer') {
      return <FooterFields key={key} section={section} setHomeSectionsForm={setHomeSectionsForm} />;
    }
    if (key === 'about_stats') {
      return <AboutStatsFields key={key} section={section} updateSectionTitle={updateSectionTitle} updateItemField={updateItemField} onAddItem={onAddItem} onDeleteItem={onDeleteItem} />;
    }
    if (key === 'about_overview') {
      return <AboutOverviewFields key={key} section={section} updateItemField={updateItemField} onAddItem={onAddItem} onDeleteItem={onDeleteItem} />;
    }

    return (
      <div key={key} className="admin-field">
        <p><small>Unknown section: {key}</small></p>
      </div>
    );
  };

  return (
    <section className="admin-card admin-home-sections-card">
      <div className="admin-card-head">
        <div>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="admin-home-tabs" role="tablist" aria-label="Home page sections">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={activeGroup?.id === group.id}
            className={`admin-home-tab${activeGroup?.id === group.id ? ' active' : ''}`}
            onClick={() => setActiveGroupId(group.id)}
          >
            <span>{group.title}</span>
            <small>{group.subtitle}</small>
          </button>
        ))}
      </div>

      <form className="admin-form-grid admin-form-grid--single-column admin-home-sections-form" onSubmit={handleSaveAll}>
        {activeGroup ? (
          <SectionShell key={activeGroup.id} title={activeGroup.title} subtitle={activeGroup.subtitle}>
            {activeGroup.keys.map((key) => renderFieldsForKey(key))}
          </SectionShell>
        ) : null}
        <div className="admin-actions admin-home-save-row">
          <button type="submit" className="admin-btn admin-btn-accent">
            <FiEdit2 />
            Save Home Sections
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminHomeSectionsPanel;
