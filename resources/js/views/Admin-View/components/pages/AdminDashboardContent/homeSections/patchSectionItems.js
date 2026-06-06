export function patchSectionItems(sections, sectionKey, updater) {
  return sections.map((section) => {
    if (section.key !== sectionKey) return section;
    return { ...section, items: updater(section.items || []) };
  });
}
