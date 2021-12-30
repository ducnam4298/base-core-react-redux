import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LocationState } from 'redux-first-router';
import {
  IBreadcrumbItem,
  IColumn,
  IContextualMenuItem,
  Text,
  Toggle,
} from 'office-ui-fabric-react';

import { ContainerUI, ListItemUI } from 'components/shared';

import { IMessage } from 'models/message';
import { IFormContext } from 'models/shared';

import { goToPage } from 'routes';
import { ApplicationState } from 'store';
import { ActionCreators as UserAction } from 'store/user';
import { ButtonUI } from 'components/templates';
import { User } from 'models/user';
import { dateConverter } from 'constant/dateConverter';
import { DropdownVer2UI } from 'components/shared/FormUI';
import { Columns, MenuActions } from '../employee/configs';
import { IFilterParams } from 'store/user/InitState';
interface State {
  goToPage: Function;
  message: IMessage;
  location: LocationState;
  formContext: IFormContext;
  filterParams?: IFilterParams;
  initValues: User;
  dataUser: {
    listUsers?: User[];
    totalUsers?: number;
  };
}
type Props = State & typeof UserAction;
const Home = (props: Props) => {
  useEffect(() => {
    props.HideToastMessage();
    props.GetUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: 'Customer',
      key: 'd1',
      style: { color: '#fff', fontStyle: 'italic' },
    },
  ];
  const onRenderNavigation = () => {
    return (
      <ButtonUI
        text={'Create New'}
        iconName={'Add'}
        onClick={() => {
          // props.FieldChange('initValues', initValuesDefault);
          // props.goToPage('Employee/Create');
        }}
      />
    );
  };
  const onItemActionClick = (evt?: any, menuItem?: IContextualMenuItem, id?: any, user?: User) => {
    switch (menuItem?.key) {
      case 'Details':
        break;
      case 'Update':
        break;
      case 'ResetPassword':
        break;
      default:
        break;
    }
  };
  const onRenderItemColumn = (item: User, index?: number, column?: IColumn) => {
    const fieldContent = item[column?.fieldName as keyof User] as string | number;
    switch (column?.key) {
      case 'STT':
        const dataIndex =
          ((props.filterParams?.skip ?? 0) / (props.filterParams?.take ?? 0)) *
            (props.filterParams?.take ?? 0) +
          (index ?? 0) +
          1;
        return <Text variant="medium">{dataIndex ?? 'N/A'}</Text>;
      case 'FullName':
        return <Text>{item.fullName ?? 'N/A'}</Text>;
      case 'DayOfBirth':
        let dob = dateConverter.formatDate(fieldContent, 'dd/MM/yyyy');
        return <Text variant="medium">{dob === '' ? 'N/A' : dob}</Text>;
      case 'Email':
        return <Text variant="medium">{item.email ?? 'N/A'}</Text>;
      case 'ModifiedDate':
        let modifiedDate = dateConverter.formatDate(fieldContent, 'dd/MM/yyyy');
        return <Text variant="medium">{modifiedDate === '' ? 'N/A' : modifiedDate}</Text>;
      case 'Status':
        return <Toggle onText={'Unblock'} offText={'Blocked'} />;
      case 'Actions':
        return (
          <DropdownVer2UI
            title="Actions"
            menuItems={MenuActions}
            onItemClick={(evt?: any, menuItem?: IContextualMenuItem) =>
              onItemActionClick(evt, menuItem, fieldContent, item)
            }
          />
        );
      default:
        return <Text variant="medium">{fieldContent}</Text>;
    }
  };
  return (
    <ContainerUI
      key={'container-ui'}
      message={props.message}
      breadcrumbItems={breadcrumbItems}
      onRenderNavigation={onRenderNavigation}
      width={'100%'}
      maxWidth={'75rem'}
    >
      <ListItemUI
        columns={Columns}
        onRenderItemColumn={onRenderItemColumn}
        onItemInvoked={undefined}
        selectionMode={undefined}
        data={{
          listItems: props.dataUser.listUsers,
          totalNumber: props.dataUser.totalUsers,
        }}
        formContext={props.formContext}
        filterName={'filterParams'}
        filterParams={props.filterParams}
        FieldChange={props.FieldChange}
      />
    </ContainerUI>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  location: state.location,
  permissions: state.ContextState.permissions,
  ...state.UserState,
});

const mapDispatchToProps = {
  ...UserAction,
  goToPage: goToPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home as any);