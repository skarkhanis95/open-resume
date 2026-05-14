import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { store, type RootState, type AppDispatch } from "lib/redux/store";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialResumeState, setResume } from "lib/redux/resumeSlice";
import {
  initialSettings,
  setSettings,
  type Settings,
} from "lib/redux/settingsSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to save store to local storage on store change
 */
export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      saveStateToLocalStorage(store.getState());
    });
    return unsubscribe;
  }, []);
};

// Migrate legacy skills shape ({featuredSkills, descriptions}) to the new
// grouped-categories array. Runs once on hydrate; no-op for users already on
// the new shape.
export const migrateLegacySkills = (resume: any) => {
  if (!resume?.skills) return;
  if (Array.isArray(resume.skills)) return;
  const legacy = resume.skills;
  const featured = Array.isArray(legacy.featuredSkills)
    ? legacy.featuredSkills
        .map((f: { skill?: string }) => f?.skill?.trim() || "")
        .filter(Boolean)
    : [];
  const descriptions = Array.isArray(legacy.descriptions)
    ? legacy.descriptions
        .map((d: string) => (typeof d === "string" ? d.trim() : ""))
        .filter(Boolean)
    : [];
  const joined = [...featured, ...descriptions].join(", ");
  resume.skills = joined ? [{ name: "", skills: joined }] : [{ name: "", skills: "" }];
};

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const state = loadStateFromLocalStorage();
    if (!state) return;
    if (state.resume) {
      migrateLegacySkills(state.resume);
      // We merge the initial state with the stored state to ensure
      // backward compatibility, since new fields might be added to
      // the initial state over time.
      const mergedResumeState = deepMerge(
        initialResumeState,
        state.resume
      ) as Resume;
      dispatch(setResume(mergedResumeState));
    }
    if (state.settings) {
      const mergedSettingsState = deepMerge(
        initialSettings,
        state.settings
      ) as Settings;
      dispatch(setSettings(mergedSettingsState));
    }
  }, []);
};
