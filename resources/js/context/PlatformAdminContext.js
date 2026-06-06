import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  STORAGE_KEY,
  mergePageContent,
  mergeUserViewPages,
  mergeHomeSections,
  loadInitialPlatformState,
  safeParse,
} from './platformAdminDefaults';
import * as homeApi from '../api/homePageAdminApi';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common.Accept = 'application/json';

const PlatformAdminContext = createContext(null);

const loadInitial = () => {
  const base = loadInitialPlatformState();
  if (typeof window === 'undefined') return base;
  const stored = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!stored) return base;
  const pageContent = mergePageContent(stored.pageContent, stored.homeContent);

  return {
    ...base,
    ...stored,
    pageContent,
    homeContent: pageContent.home,
    userViewPages: mergeUserViewPages(stored.userViewPages),
    homeSections: mergeHomeSections(stored.homeSections),
    settings: {
      ...base.settings,
      ...(stored.settings || {}),
    },
  };
};

export const PlatformAdminProvider = ({ children }) => {
  const [data, setData] = useState(loadInitial);

  const persist = (next) => {
    setData(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const payload = await homeApi.getHomePagePayload();
        const serverHomeContent = payload?.homeContent;
        const serverHomeSections = payload?.homeSections;
        const serverPageContent = payload?.pageContent;
        if ((!serverHomeContent && !serverHomeSections && !serverPageContent) || cancelled) return;

        setData((current) => {
          const nextPageContent = mergePageContent({
            ...current.pageContent,
            ...(serverPageContent || {}),
          }, serverHomeContent);
          const next = {
            ...current,
            homeContent: {
              ...current.homeContent,
              ...serverHomeContent,
            },
            homeSections: Array.isArray(serverHomeSections) && serverHomeSections.length > 0
              ? serverHomeSections
              : current.homeSections,
            pageContent: nextPageContent,
          };

          if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          }

          return next;
        });
      } catch {
        
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const addRecord = (section, record) => {
    persist({
      ...data,
      [section]: [{ ...record, id: record.id || `${section}-${Date.now()}` }, ...(data[section] || [])],
    });
  };

  const updateRecord = (section, id, updates) => {
    persist({
      ...data,
      [section]: (data[section] || []).map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const deleteRecord = (section, id) => {
    persist({
      ...data,
      [section]: (data[section] || []).filter((item) => item.id !== id),
    });
  };

  const updateSetting = (key, value) => {
    persist({
      ...data,
      settings: { ...data.settings, [key]: value },
    });
  };

  const updateHomeContent = async (updates) => {
    const nextHomeContent = { ...data.homeContent, ...updates };
    const optimisticState = {
      ...data,
      homeContent: nextHomeContent,
      pageContent: {
        ...data.pageContent,
        home: nextHomeContent,
      },
    };
    persist(optimisticState);

    try {
      const payload = await homeApi.putHomePageContent(nextHomeContent, 'home');
      if (!payload?.homeContent) return;

      persist({
        ...optimisticState,
        homeContent: payload.homeContent,
        pageContent: {
          ...optimisticState.pageContent,
          ...(payload.pageContent || {}),
          home: payload.homeContent,
        },
      });
    } catch {
      
    }
  };

  const updateHomeSections = async (sections) => {
    const nextSections = Array.isArray(sections) ? sections : data.homeSections;
    const optimisticState = {
      ...data,
      homeSections: nextSections,
    };
    persist(optimisticState);

    try {
      const payload = await homeApi.putHomePageSections(nextSections);
      if (!Array.isArray(payload?.homeSections)) return false;

      persist({
        ...optimisticState,
        homeSections: payload.homeSections,
      });
      return true;
    } catch {
      return false;
    }
  };

  const uploadHomeSectionImage = async (file, sectionKey) => {
    try {
      return await homeApi.uploadHomeSectionImage(file, sectionKey);
    } catch {
      return null;
    }
  };

  const refreshHomePageFromApi = async () => {
    try {
      const payload = await homeApi.getHomePagePayload();
      setData((current) => {
        const next = {
          ...current,
          ...(payload?.homeContent
            ? {
                homeContent: { ...current.homeContent, ...payload.homeContent },
                pageContent: mergePageContent({
                  ...current.pageContent,
                  ...(payload.pageContent || {}),
                  home: { ...current.pageContent?.home, ...payload.homeContent },
                }, payload.homeContent),
              }
            : {}),
          ...(Array.isArray(payload?.homeSections) ? { homeSections: payload.homeSections } : {}),
        };
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    } catch {
      
    }
  };

  const createHomeSectionItem = async (sectionKey, itemPayload) => {
    try {
      const res = await homeApi.postSectionItem(sectionKey, itemPayload);
      await refreshHomePageFromApi();
      return res?.item ?? null;
    } catch {
      return null;
    }
  };

  const updateHomeSectionItem = async (itemId, itemPayload) => {
    try {
      const res = await homeApi.putSectionItem(itemId, itemPayload);
      await refreshHomePageFromApi();
      return res?.item ?? null;
    } catch {
      return null;
    }
  };

  const deleteHomeSectionItem = async (itemId) => {
    try {
      await homeApi.deleteSectionItem(itemId);
      await refreshHomePageFromApi();
      return true;
    } catch {
      return false;
    }
  };

  const updatePageContent = async (pageKey, updates) => {
    if (pageKey === 'home') {
      await updateHomeContent(updates);
      return true;
    }

    const nextPageContent = {
      ...data.pageContent,
      [pageKey]: {
        ...(data.pageContent?.[pageKey] || {}),
        ...updates,
      },
    };

    const optimisticState = {
      ...data,
      pageContent: nextPageContent,
      homeContent: pageKey === 'home' ? nextPageContent.home : data.homeContent,
    };
    persist(optimisticState);

    if (pageKey === 'about' || pageKey === 'pricing' || pageKey === 'companies' || pageKey === 'contact' || pageKey === 'jobs') {
      try {
        const payload = await homeApi.putHomePageContent(nextPageContent[pageKey], pageKey);
        if (!payload?.pageContent?.[pageKey]) return true;

        persist({
          ...optimisticState,
          pageContent: {
            ...optimisticState.pageContent,
            ...payload.pageContent,
          },
          ...(payload.homeContent ? { homeContent: payload.homeContent } : {}),
        });
        return true;
      } catch {
        return false;
      }
    }

    return true;
  };

  const addActivityLog = (record) => {
    const nextLog = {
      ...record,
      id: record.id || `log-${Date.now()}`,
    };

    persist({
      ...data,
      activityLogs: [nextLog, ...(data.activityLogs || [])].slice(0, 150),
    });
  };

  const value = useMemo(
    () => ({
      data,
      addRecord,
      updateRecord,
      deleteRecord,
      updateSetting,
      updateHomeContent,
      updateHomeSections,
      uploadHomeSectionImage,
      refreshHomePageFromApi,
      createHomeSectionItem,
      updateHomeSectionItem,
      deleteHomeSectionItem,
      updatePageContent,
      addActivityLog,
    }),
    [data],
  );

  return <PlatformAdminContext.Provider value={value}>{children}</PlatformAdminContext.Provider>;
};

export const usePlatformAdmin = () => {
  const ctx = useContext(PlatformAdminContext);
  if (!ctx) throw new Error('usePlatformAdmin must be used inside PlatformAdminProvider');
  return ctx;
};
