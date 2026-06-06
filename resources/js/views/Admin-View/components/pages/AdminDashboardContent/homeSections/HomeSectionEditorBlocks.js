import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { CATEGORY_ICON_OPTIONS } from '../../../../../../utils/categoryIcons';
import { patchSectionItems } from './patchSectionItems';

const SECTION_LABELS = {
  banner: 'Banner avatars',
  trusted_by: 'Trusted by logos',
};

export function ImageSectionFields({
  section,
  updateSectionTitle,
  updateItemField,
  onUploadImage,
  uploadingKey,
}) {
  const label = SECTION_LABELS[section.key] || section.key;
  return (
    <div className="admin-home-subblock">
      <h4 className="admin-home-subheading">{label}</h4>
      <div className="admin-field">
        <label>Section title</label>
        <input value={section.title || ''} onChange={(e) => updateSectionTitle(section.key, e.target.value)} />
      </div>
      {(section.items || []).map((item, itemIndex) => (
        <div key={item.id || `${section.key}-${itemIndex}`} className="admin-home-item-card">
          <div className="admin-home-item-card__head">
            <strong>Image {itemIndex + 1}</strong>
            {uploadingKey === `${section.key}-${itemIndex}` ? <small>Uploading...</small> : null}
          </div>
          <div className="admin-home-field-grid">
            <div className="admin-field">
              <label>Image URL</label>
              <input
                value={item.imageUrl || ''}
                onChange={(e) => updateItemField(section.key, itemIndex, 'imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="admin-field">
              <label>Upload image</label>
              <input type="file" accept="image/*" onChange={(e) => onUploadImage(e, section.key, itemIndex)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoriesFields({
  section,
  updateSectionTitle,
  updateItemField,
  updateItemMetadata,
  onAddItem,
  onDeleteItem,
}) {
  return (
    <div className="admin-field">
      <div className="admin-home-row">
        <label>Categories</label>
        <button
          type="button"
          className="admin-btn admin-btn-light"
          onClick={() => onAddItem('categories', {
            title: 'New category',
            metadata: { slug: 'new-category', positions: 0, iconKey: 'FaCode' },
            sortOrder: (section.items?.length || 0) + 1,
            isActive: true,
          })}
        >
          <FiPlus /> Add
        </button>
      </div>
      <div className="admin-field">
        <label>Section title</label>
        <input value={section.title || ''} onChange={(e) => updateSectionTitle(section.key, e.target.value)} placeholder="Optional section title" />
      </div>
      {(section.items || []).map((item, idx) => (
        <div key={item.id || idx} className="admin-home-item-card">
          <div className="admin-home-item-card__head">
            <strong>Category {idx + 1}</strong>
            <button type="button" className="admin-btn admin-btn-light admin-btn-danger" onClick={() => onDeleteItem(item)}>
              <FiTrash2 /> Remove
            </button>
          </div>
          <div className="admin-home-field-grid">
            <div className="admin-field">
              <label>Title</label>
              <input value={item.title || ''} onChange={(e) => updateItemField(section.key, idx, 'title', e.target.value)} placeholder="Graphics & Design" />
            </div>
            <div className="admin-field">
              <label>Slug</label>
              <input
                value={item.metadata?.slug || ''}
                onChange={(e) => updateItemMetadata(section.key, idx, { slug: e.target.value })}
                placeholder="graphics-design"
              />
            </div>
            <div className="admin-field">
              <label>Open positions</label>
              <input
                type="number"
                value={item.metadata?.positions ?? 0}
                onChange={(e) => updateItemMetadata(section.key, idx, { positions: Number(e.target.value) })}
                placeholder="357"
              />
            </div>
            <div className="admin-field">
              <label>Icon</label>
              <select
                value={item.metadata?.iconKey || 'FaCode'}
                onChange={(e) => updateItemMetadata(section.key, idx, { iconKey: e.target.value })}
              >
                {CATEGORY_ICON_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompaniesFields({
  section,
  updateItemField,
  updateItemMetadata,
  onUploadImage,
  uploadingKey,
  onAddItem,
  onDeleteItem,
}) {
  const formatReviews = (reviews) => JSON.stringify(Array.isArray(reviews) ? reviews : [], null, 2);
  const updateReviews = (idx, text) => {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) updateItemMetadata(section.key, idx, { reviews: parsed });
    } catch {
    }
  };

  return (
    <div className="admin-field">
      <div className="admin-home-row">
        <label>Company cards</label>
        <button
          type="button"
          className="admin-btn admin-btn-light"
          onClick={() => onAddItem('companies_cards', {
            title: 'New company',
            subtitle: 'Industry',
            description: 'Description',
            metadata: {
              companyId: Date.now(),
              employees: '—',
              location: '—',
              openRoles: '—',
              detailIntro: 'Learn about this company and read feedback shared by people who have worked there.',
              history: 'Company history and background.',
              reviews: [],
            },
            sortOrder: (section.items?.length || 0) + 1,
            isActive: true,
          })}
        >
          <FiPlus /> Add
        </button>
      </div>
      {(section.items || []).map((item, idx) => (
        <div key={item.id || idx} className="admin-home-item-card">
          <div className="admin-home-item-card__head">
            <strong>{item.title || `Company ${idx + 1}`}</strong>
            <button type="button" className="admin-btn admin-btn-light admin-btn-danger" onClick={() => onDeleteItem(item)}>
              <FiTrash2 /> Remove
            </button>
          </div>
          <div className="admin-home-field-grid">
            <div className="admin-field">
              <label>Name</label>
              <input value={item.title || ''} onChange={(e) => updateItemField(section.key, idx, 'title', e.target.value)} placeholder="Company name" />
            </div>
            <div className="admin-field">
              <label>Industry</label>
              <input value={item.subtitle || ''} onChange={(e) => updateItemField(section.key, idx, 'subtitle', e.target.value)} placeholder="Cloud Communications" />
            </div>
            <div className="admin-field admin-field--full">
              <label>Description</label>
              <textarea value={item.description || ''} onChange={(e) => updateItemField(section.key, idx, 'description', e.target.value)} placeholder="Short company description" rows={2} />
            </div>
            <div className="admin-field">
              <label>Logo URL</label>
              <input value={item.imageUrl || ''} onChange={(e) => updateItemField(section.key, idx, 'imageUrl', e.target.value)} placeholder="https://example.com/logo.png" />
            </div>
            <div className="admin-field">
              <label>Upload logo</label>
              <input type="file" accept="image/*" onChange={(e) => onUploadImage(e, section.key, idx)} />
              {uploadingKey === `${section.key}-${idx}` ? <small>Uploading...</small> : null}
            </div>
            <div className="admin-field">
              <label>Company ID</label>
              <input
                type="number"
                value={item.metadata?.companyId ?? ''}
                onChange={(e) => updateItemMetadata(section.key, idx, { companyId: Number(e.target.value) })}
                placeholder="Company ID for URL"
              />
            </div>
            <div className="admin-field">
              <label>Employees</label>
              <input value={item.metadata?.employees || ''} onChange={(e) => updateItemMetadata(section.key, idx, { employees: e.target.value })} placeholder="900+ employees" />
            </div>
            <div className="admin-field">
              <label>Location</label>
              <input value={item.metadata?.location || ''} onChange={(e) => updateItemMetadata(section.key, idx, { location: e.target.value })} placeholder="Prizren, Kosovo" />
            </div>
            <div className="admin-field">
              <label>Open roles</label>
              <input value={item.metadata?.openRoles || ''} onChange={(e) => updateItemMetadata(section.key, idx, { openRoles: e.target.value })} placeholder="12 open roles" />
            </div>
            <div className="admin-field admin-field--full">
              <label>Details page intro</label>
              <textarea
                value={item.metadata?.detailIntro || ''}
                onChange={(e) => updateItemMetadata(section.key, idx, { detailIntro: e.target.value })}
                placeholder="Short intro shown on the company details page"
                rows={2}
              />
            </div>
            <div className="admin-field admin-field--full">
              <label>Company history</label>
              <textarea
                value={item.metadata?.history || ''}
                onChange={(e) => updateItemMetadata(section.key, idx, { history: e.target.value })}
                placeholder="Longer company story for the details page"
                rows={4}
              />
            </div>
            <div className="admin-field admin-field--full">
              <label>Reviews JSON</label>
              <textarea
                key={`${item.id || idx}-${JSON.stringify(item.metadata?.reviews || [])}`}
                defaultValue={formatReviews(item.metadata?.reviews)}
                onBlur={(e) => updateReviews(idx, e.target.value)}
                rows={7}
              />
              <small>Use an array of objects with author, role, rating, and comment.</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FindJobFields({ section, updateItemField, updateItemMetadata }) {
  const item = (section.items || [])[0] || {};
  const idx = 0;
  return (
    <div className="admin-field">
      <label>Find job block</label>
      <div className="admin-home-item-card">
        <div className="admin-home-field-grid">
          <div className="admin-field">
            <label>Headline</label>
            <input value={item.title || ''} onChange={(e) => updateItemField(section.key, idx, 'title', e.target.value)} placeholder="Headline" />
          </div>
          <div className="admin-field">
            <label>Highlighted word</label>
            <input value={item.subtitle || ''} onChange={(e) => updateItemField(section.key, idx, 'subtitle', e.target.value)} placeholder="Remote" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Description</label>
            <textarea value={item.description || ''} onChange={(e) => updateItemField(section.key, idx, 'description', e.target.value)} placeholder="Description" rows={3} />
          </div>
          <div className="admin-field">
            <label>Button label</label>
            <input value={item.ctaText || ''} onChange={(e) => updateItemField(section.key, idx, 'ctaText', e.target.value)} placeholder="Find jobs" />
          </div>
          <div className="admin-field">
            <label>Button link</label>
            <input
              value={item.metadata?.ctaHref || '/jobs'}
              onChange={(e) => updateItemMetadata(section.key, idx, { ctaHref: e.target.value })}
              placeholder="/jobs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsFields({
  section,
  updateSectionTitle,
  updateItemField,
  onAddItem,
  onDeleteItem,
}) {
  return (
    <div className="admin-field">
      <div className="admin-home-row">
        <label>Testimonials</label>
        <button
          type="button"
          className="admin-btn admin-btn-light"
          onClick={() => onAddItem('testimonials', {
            title: 'Name',
            subtitle: 'Role, Location',
            description: 'Quote text',
            sortOrder: (section.items?.length || 0) + 1,
            isActive: true,
          })}
        >
          <FiPlus /> Add
        </button>
      </div>
      <div className="admin-field">
        <label>Section heading</label>
        <input value={section.title || ''} onChange={(e) => updateSectionTitle(section.key, e.target.value)} placeholder="Section heading" />
      </div>
      {(section.items || []).map((item, idx) => (
        <div key={item.id || idx} className="admin-home-item-card">
          <div className="admin-home-item-card__head">
            <strong>{item.title || `Testimonial ${idx + 1}`}</strong>
            <button type="button" className="admin-btn admin-btn-light admin-btn-danger" onClick={() => onDeleteItem(item)}>
              <FiTrash2 /> Remove
            </button>
          </div>
          <div className="admin-home-field-grid">
            <div className="admin-field admin-field--full">
              <label>Quote</label>
              <textarea value={item.description || ''} onChange={(e) => updateItemField(section.key, idx, 'description', e.target.value)} placeholder="Quote" rows={3} />
            </div>
            <div className="admin-field">
              <label>Name</label>
              <input value={item.title || ''} onChange={(e) => updateItemField(section.key, idx, 'title', e.target.value)} placeholder="Name" />
            </div>
            <div className="admin-field">
              <label>Role / location</label>
              <input value={item.subtitle || ''} onChange={(e) => updateItemField(section.key, idx, 'subtitle', e.target.value)} placeholder="Role / location" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FooterFields({ section, setHomeSectionsForm }) {
  const item = (section.items || [])[0];
  const meta = item?.metadata || {};
  const brand = meta.brand || {};
  const social = Array.isArray(meta.social) ? meta.social : [];
  const columns = Array.isArray(meta.columns) ? meta.columns : [];

  const setFooterMeta = (patch) => {
    setHomeSectionsForm((current) => patchSectionItems(current, 'footer', (items) => {
      if (!items.length) {
        return [{ title: 'footer_config', sortOrder: 1, isActive: true, metadata: patch }];
      }
      return items.map((it, i) => (i === 0 ? { ...it, metadata: { ...(it.metadata || {}), ...patch } } : it));
    }));
  };

  const updateBrand = (patch) => setFooterMeta({ brand: { ...brand, ...patch } });
  const updateCopyright = (copyright) => setFooterMeta({ copyright });
  const updateSocialRow = (i, patch) => {
    const next = social.map((row, j) => (j === i ? { ...row, ...patch } : row));
    setFooterMeta({ social: next });
  };
  const addSocial = () => setFooterMeta({ social: [...social, { iconKey: 'FaLinkedinIn', url: '/', label: 'Social' }] });
  const removeSocial = (i) => setFooterMeta({ social: social.filter((_, j) => j !== i) });

  const columnsJson = JSON.stringify(columns, null, 2);
  const setColumnsFromJson = (text) => {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) setFooterMeta({ columns: parsed });
    } catch {
    }
  };

  return (
    <div className="admin-field">
      <label>Brand</label>
      <div className="admin-home-item-card">
        <div className="admin-home-field-grid">
          <div className="admin-field admin-field--full">
            <label>Tagline</label>
            <input value={brand.tagline || ''} onChange={(e) => updateBrand({ tagline: e.target.value })} placeholder="Tagline" />
          </div>
          <div className="admin-field">
            <label>Phone</label>
            <input value={brand.phone || ''} onChange={(e) => updateBrand({ phone: e.target.value })} placeholder="Phone" />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input value={brand.email || ''} onChange={(e) => updateBrand({ email: e.target.value })} placeholder="Email" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Copyright line</label>
            <input value={meta.copyright || ''} onChange={(e) => updateCopyright(e.target.value)} placeholder="Copyright line" />
          </div>
        </div>
      </div>

      <div className="admin-home-subblock">
        <h4 className="admin-home-subheading">Social links</h4>
        {social.map((row, i) => (
          <div key={i} className="admin-home-item-card">
            <div className="admin-home-item-card__head">
              <strong>{row.label || `Social link ${i + 1}`}</strong>
              <button type="button" className="admin-btn admin-btn-light admin-btn-danger" onClick={() => removeSocial(i)}>Remove</button>
            </div>
            <div className="admin-home-field-grid">
              <div className="admin-field">
                <label>Icon key</label>
                <input value={row.iconKey || ''} onChange={(e) => updateSocialRow(i, { iconKey: e.target.value })} placeholder="Icon key" />
              </div>
              <div className="admin-field">
                <label>URL</label>
                <input value={row.url || ''} onChange={(e) => updateSocialRow(i, { url: e.target.value })} placeholder="URL" />
              </div>
              <div className="admin-field admin-field--full">
                <label>Label</label>
                <input value={row.label || ''} onChange={(e) => updateSocialRow(i, { label: e.target.value })} placeholder="Label" />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn-light" onClick={addSocial}><FiPlus /> Add social</button>
      </div>

      <div className="admin-home-subblock">
        <h4 className="admin-home-subheading">Link columns (JSON)</h4>
        <small>Tab out to apply before Save.</small>
        <textarea
          rows={10}
          defaultValue={columnsJson}
          key={columnsJson}
          onBlur={(e) => setColumnsFromJson(e.target.value)}
        />
      </div>
    </div>
  );
}

export function AboutStatsFields({ section, updateSectionTitle, updateItemField, onAddItem, onDeleteItem }) {
  return (
    <div className="admin-field">
      <div className="admin-home-row">
        <label>Stats</label>
        <button
          type="button"
          className="admin-btn admin-btn-light"
          onClick={() => onAddItem('about_stats', { title: '0', subtitle: 'New Stat', sortOrder: (section.items?.length || 0) + 1, isActive: true })}
        >
          <FiPlus /> Add
        </button>
      </div>
      <div className="admin-field">
        <label>Section title</label>
        <input value={section.title || ''} onChange={(e) => updateSectionTitle(section.key, e.target.value)} placeholder="e.g. Our Work" />
      </div>
      {(section.items || []).map((item, idx) => (
        <div key={item.id || idx} className="admin-home-item-card">
          <div className="admin-home-item-card__head">
            <strong>Stat {idx + 1}</strong>
            <button type="button" className="admin-btn admin-btn-danger" onClick={() => onDeleteItem(item)}><FiTrash2 /></button>
          </div>
          <div className="admin-home-field-grid">
            <div className="admin-field">
              <label>Number</label>
              <input value={item.title || ''} onChange={(e) => updateItemField(section.key, idx, 'title', e.target.value)} placeholder="e.g. 2500" />
            </div>
            <div className="admin-field">
              <label>Label</label>
              <input value={item.subtitle || ''} onChange={(e) => updateItemField(section.key, idx, 'subtitle', e.target.value)} placeholder="e.g. Applications Processed" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AboutOverviewFields({ section, updateItemField, onAddItem, onDeleteItem }) {
  return (
    <div className="admin-field">
      <div className="admin-home-row">
        <label>Overview Panels</label>
        <button
          type="button"
          className="admin-btn admin-btn-light"
          onClick={() => onAddItem('about_overview', { title: 'New Panel', description: '', sortOrder: (section.items?.length || 0) + 1, isActive: true })}
        >
          <FiPlus /> Add
        </button>
      </div>
      {(section.items || []).map((item, idx) => (
        <div key={item.id || idx} className="admin-home-item-card">
          <div className="admin-home-item-card__head">
            <strong>Panel {idx + 1}</strong>
            <button type="button" className="admin-btn admin-btn-danger" onClick={() => onDeleteItem(item)}><FiTrash2 /></button>
          </div>
          <div className="admin-field">
            <label>Title</label>
            <input value={item.title || ''} onChange={(e) => updateItemField(section.key, idx, 'title', e.target.value)} placeholder="e.g. What BeeHired Solves" />
          </div>
          <div className="admin-field">
            <label>Description</label>
            <textarea rows={4} value={item.description || ''} onChange={(e) => updateItemField(section.key, idx, 'description', e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  );
}
