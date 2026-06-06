import React, { useMemo } from 'react';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';

const LinksTable = () => {
    const {
        data,
        updateRecord,
    } = usePlatformAdmin();
    const pages = useMemo(() => [...data.userViewPages].sort((a, b) => a.navOrder - b.navOrder), [data.userViewPages]);

    return (
        <section className="admin-card admin-nav-visibility-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Navigation and page visibility</h2>
                        <p>
                          Control which pages appear in the site navigation, their order, and whether visitors can open them directly.
                          Changes apply on this browser immediately (stored locally until a server setting is added).
                        </p>
                    </div>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Page</th>
                            <th>Path</th>
                            <th>Page enabled</th>
                            <th>Show in nav</th>
                            <th>Nav order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((page) => (
                            <tr key={page.id}>
                                <td>{page.title}</td>
                                <td>{page.path}</td>
                                <td>
                                    <select
                                        value={String(page.enabled)}
                                        onChange={(e) => updateRecord('userViewPages', page.id, { enabled: e.target.value === 'true' })}
                                    >
                                        <option value="true">Enabled</option>
                                        <option value="false">Disabled</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={String(page.showInNav)}
                                        onChange={(e) => updateRecord('userViewPages', page.id, { showInNav: e.target.value === 'true' })}
                                    >
                                        <option value="true">Visible</option>
                                        <option value="false">Hidden</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={page.navOrder}
                                        onChange={(e) => updateRecord('userViewPages', page.id, { navOrder: Number(e.target.value) })}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </section>
    );
};

export default LinksTable;
