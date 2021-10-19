// import { Endpoint } from 'api';
import { clientStorage, sessionStorage } from 'constant/clientStorage';
import { Reducer as ReduxReducer } from 'redux';
import { ActionType } from './ActionType';
import { SwitchAuthenticated, IUser } from 'models/context';
import InitState, { State } from './InitState';

import { client, setToken, clearToken } from 'api/client';

import { Endpoint } from 'api';
// import { loadTranslations, setLocale } from 'react-redux-i18n';
import { ThunkAction } from 'store';
//#region declare actions
interface ChangeLanguageAction {
  type: string;
  language: string;
}

interface ChangeThemeAction {
  type: string;
  theme: string;
}

interface SwitchRoleAction {
  type: string;
  roleId: number;
}

interface SwitchAppAction {
  type: string;
  app: string;
}

interface LoadingAction {
  type: string;
}

interface LoadedAction {
  type: string;
}

interface RequestItemsAction {
  type: string;
  dataType: string;
}

interface RequestItemAction {
  type: string;
  dataType: string;
  itemId: number | string | undefined;
}

interface FormFieldChangeAction {
  type: string;
  dataType: string;
  fieldName: string;
  fieldValue: any;
}

interface NewFormAction {
  type: string;
  dataType: string;
  schema?: any;
}

interface UpdateFormAction {
  type: string;
  dataType: string;
  item: any;
}

interface SwitchAuthenticatedAction {
  type: string;
  action: SwitchAuthenticated;
  dataItem?: any;
}

interface GetDataUserAction {
  type: string;
  user?: IUser;
}

interface GetConfigurationAction {
  type: string;
  configs?: any[];
}

interface GetRolesUserAction {
  type: string;
  permissions?: any[];
}

interface GetLanguageAction {
  type: string;
  languages: any;
}

interface FieldChangAction {
  type: string;
  fieldName: string;
  fieldValue?: any;
}

type KnownAction =
  | ChangeLanguageAction
  | ChangeThemeAction
  | SwitchRoleAction
  | SwitchAppAction
  | LoadingAction
  | LoadedAction
  | RequestItemsAction
  | RequestItemAction
  | FormFieldChangeAction
  | NewFormAction
  | UpdateFormAction
  | SwitchAuthenticatedAction
  | GetDataUserAction
  | GetConfigurationAction
  | GetRolesUserAction
  | GetLanguageAction
  | FieldChangAction;
//#endregion
//#region ActionCreators
export const ActionCreators = {
  Loading: (): ThunkAction<KnownAction> => (dispatch, getState) => {
    const actionState = getState();
    if (actionState && actionState.ContextState && !actionState.ContextState.loading) {
      dispatch({
        type: ActionType.LOADING,
      });
    }
  },
  Loaded: (): ThunkAction<KnownAction> => (dispatch, getState) => {
    const actionState = getState();
    if (actionState && actionState.ContextState && actionState.ContextState.loading) {
      dispatch({
        type: ActionType.LOADED,
      });
    }
  },
  ChangeLanguage:
    (language?: string): ThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      try {
        const actionState = getState();
        await client.put(Endpoint.LANGUAGE_USER_URL, { language });
        if (
          actionState &&
          actionState.ContextState &&
          actionState.ContextState.language !== language
        ) {
          //   dispatch(setLocale(language));
          clientStorage.set('I18nLang', language);
          dispatch({
            type: ActionType.CHANGE_LANGUAGE,
            language: language,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  ChangeTheme:
    (theme: string): ThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const actionState = getState();
      if (actionState && actionState.ContextState && actionState.ContextState.theme !== theme) {
        dispatch({
          type: ActionType.CHANGE_LANGUAGE,
          theme: theme,
        });
      }
    },

  SwitchAuthenticated:
    (action: SwitchAuthenticated, dataItem?: any, cb?: any): ThunkAction<KnownAction> =>
    (dispatch, getState) => {
      if (action === SwitchAuthenticated.LOGGEDIN) {
        clientStorage.set('sp-afro4isc', dataItem.accessToken);
        clientStorage.set('rt-afro4isc', dataItem.refreshToken);
        setToken(dataItem.accessToken);
        cb && cb();
      } else {
        clientStorage.remove('sp-afro4isc');
        clientStorage.remove('rt-afro4isc');
        sessionStorage.clear();
        dispatch({
          type: ActionType.GET_DATA_USER,
          user: undefined,
        });
        dispatch({
          type: ActionType.GET_ROLES_USER,
          permissions: [],
        });
        clearToken();
        cb && cb();
      }
      dispatch({
        type: ActionType.SWITCH_AUTHENTICATED,
        action,
      });
    },

  GetSiteConfiguration: (): ThunkAction<KnownAction> => async (dispatch, getState) => {
    const res = await client.get(`${Endpoint.CONFIGURATION_URL}/all`);
    if (res?.status === 200) {
      const data = (res?.data ?? [])?.map((item: any) => {
        return {
          configName: item.configName,
          configValue: item.configValue,
        };
      });
      sessionStorage.set('cf', data);
      dispatch({
        type: ActionType.GET_CONFIGURATION,
        configs: data,
      });
      // ActionCreators.UpdateSiteConfiguration(res?.data)
    } else {
      ActionCreators.SwitchAuthenticated(SwitchAuthenticated.LOGGEDOUT);
    }
  },

  GetLanguage: (): ThunkAction<KnownAction> => async (dispatch, getState) => {
    const res = await client.get(`${Endpoint.LANGUAGE_URL}/all`);
    if (res?.status === 200) {
      let en = {},
        fr = {};
      res?.data?.length &&
        res.data.forEach((item:any) => {
          en[item.key] = item.valueEn;
          fr[item.key] = item.valueFr;
        });
      sessionStorage.set('lng', { fr, en });
      //   dispatch(loadTranslations({ fr, en }));
      dispatch({
        type: ActionType.GET_LANGUAGE,
        languages: { en, fr },
      });
    }
  },

  FieldChange:
    (fieldName: string, fieldValue?: any): ThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      dispatch({
        type: ActionType.FIELD_CHANGE,
        fieldName: fieldName,
        fieldValue: fieldValue,
      });
    },
};
//#endregion
const initState = InitState;

export const Reducer: ReduxReducer<State, KnownAction> = (
  state: State | undefined,
  incomingAction: KnownAction
): State => {
  if (state === undefined) {
    return initState;
  }
  let action;
  switch (incomingAction.type) {
    case ActionType.LOADING:
      action = incomingAction as LoadingAction;
      return {
        ...state,
        loading: true,
      };
    case ActionType.LOADED:
      action = incomingAction as LoadedAction;
      return {
        ...state,
        loading: false,
      };
    case ActionType.CHANGE_LANGUAGE:
      action = incomingAction as ChangeLanguageAction;
      return {
        ...state,
        language: action.language,
      };
    case ActionType.CHANGE_THEME:
      action = incomingAction as ChangeThemeAction;
      return {
        ...state,
        language: action.theme,
      };

    case ActionType.REQUEST_ITEMS:
      action = incomingAction as RequestItemsAction;
      // update loading here ...
      return {
        ...state,
        listItems: {
          ...state.listItems,
          [action.dataType]: [],
        },
      };

    case ActionType.REQUEST_ITEM:
      action = incomingAction as RequestItemAction;
      // update loading here ...
      return {
        ...state,
        item: {
          ...state.item,
          [action.dataType]: {},
        },
      };
    case ActionType.FIELD_CHANGE:
      action = incomingAction as FieldChangAction;
      return {
        ...state,
        [action.fieldName]: action.fieldValue,
      };
    case ActionType.FORM_FIELD_CHANGE:
      action = incomingAction as FormFieldChangeAction;
      return {
        ...state,
        item: {
          ...state.item,
          [action.dataType]: {
            ...state.item?.[action.dataType],
            [action.fieldName]: action.fieldValue,
          },
        },
      };
    case ActionType.NEW_FORM:
      action = incomingAction as NewFormAction;
      return {
        ...state,
        item: {
          ...state.item,
          [action.dataType]: {},
        },
      };
    case ActionType.UPDATE_FORM:
      action = incomingAction as UpdateFormAction;
      return {
        ...state,
        item: {
          ...state.item,
          [action.dataType]: action.item,
        },
      };
    case ActionType.SWITCH_AUTHENTICATED:
      action = incomingAction as SwitchAuthenticatedAction;
      if (action.action === SwitchAuthenticated.LOGGEDIN) {
        return {
          ...state,
          isAuthenticated: true,
        };
      } else {
        return {
          ...state,
          isAuthenticated: false,
          //   user: undefined,
          languages: [],
          permissions: [],
        };
      }
    case ActionType.GET_DATA_USER:
      action = incomingAction as GetDataUserAction;
      return {
        ...state,
        // user: action.user,
      };
    case ActionType.GET_CONFIGURATION:
      action = incomingAction as GetConfigurationAction;
      return {
        ...state,
        siteConfiguration: action.configs,
      };
    case ActionType.GET_ROLES_USER:
      action = incomingAction as GetConfigurationAction;
      return {
        ...state,
        permissions: action.permissions,
      };
    case ActionType.GET_LANGUAGE:
      action = incomingAction as GetLanguageAction;
      return {
        ...state,
        languages: action.languages,
      };
    default:
      return {
        ...state,
      };
  }
};