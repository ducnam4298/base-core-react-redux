import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LocationState } from 'redux-first-router';
import { IBreadcrumbItem } from 'office-ui-fabric-react';

import { ContainerUI } from 'components/shared';
import { IMessage } from 'models/message';
import { IFormContext } from 'models/shared';

import { goToPage } from 'routes';
import { ApplicationState } from 'store';
import { ActionCreators as ProductAction } from 'store/product';
interface State {
  message: IMessage;
  location: LocationState;
  action: IFormContext;
}
type Props = State & typeof ProductAction;
const Home = (props: Props) => {
  useEffect(() => {
    props.HideToastMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: 'Product',
      key: 'd1',
      style: { color: '#fff', fontStyle: 'italic' },
    },
  ];
  return (
    <ContainerUI
      message={props.message}
      breadcrumbItems={breadcrumbItems}
      width={'100%'}
      maxWidth={'75rem'}
      margin={0}
    >
      Product
    </ContainerUI>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  location: state.location,
  permissions: state.ContextState.permissions,
  ...state.HomeState,
});

const mapDispatchToProps = {
  ...ProductAction,
  goToPage: goToPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home as any);