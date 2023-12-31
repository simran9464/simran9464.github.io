import * as React from 'react';

import { ContentLayout, HeaderLayout, LinkButton, Main } from '@strapi/design-system';
import {
  CheckPagePermissions,
  NoContent,
  NoPermissions,
  SettingsPageTitle,
  useFetchClient,
  useFocusWhenNavigate,
  useGuidedTour,
  useNotification,
  useRBAC,
  useTracking,
} from '@strapi/helper-plugin';
import { Plus } from '@strapi/icons';
import { Entity } from '@strapi/types';
import { AxiosError } from 'axios';
import qs from 'qs';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { selectAdminPermissions } from '../../../../selectors';
import { TRANSFER_TOKEN_TYPE } from '../../components/Tokens/constants';
import { Table } from '../../components/Tokens/Table';

const tableHeaders = [
  {
    name: 'name',
    key: 'name',
    metadatas: {
      label: {
        id: 'Settings.tokens.ListView.headers.name',
        defaultMessage: 'Name',
      },
      sortable: true,
    },
  },
  {
    name: 'description',
    key: 'description',
    metadatas: {
      label: {
        id: 'Settings.tokens.ListView.headers.description',
        defaultMessage: 'Description',
      },
      sortable: false,
    },
  },
  {
    name: 'createdAt',
    key: 'createdAt',
    metadatas: {
      label: {
        id: 'Settings.tokens.ListView.headers.createdAt',
        defaultMessage: 'Created at',
      },
      sortable: false,
    },
  },
  {
    name: 'lastUsedAt',
    key: 'lastUsedAt',
    metadatas: {
      label: {
        id: 'Settings.tokens.ListView.headers.lastUsedAt',
        defaultMessage: 'Last used',
      },
      sortable: false,
    },
  },
] as const;

/* -------------------------------------------------------------------------------------------------
 * ListView
 * -----------------------------------------------------------------------------------------------*/

const ListView = () => {
  useFocusWhenNavigate();
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const permissions = useSelector(selectAdminPermissions);
  const {
    allowedActions: { canCreate, canDelete, canUpdate, canRead },
    // @ts-expect-error this is fine
  } = useRBAC(permissions.settings['transfer-tokens']);
  const { push } = useHistory();
  const { trackUsage } = useTracking();

  const { startSection } = useGuidedTour();
  const startSectionRef = React.useRef(startSection);
  const { get, del } = useFetchClient();

  React.useEffect(() => {
    if (startSectionRef.current) {
      startSectionRef.current('transferTokens');
    }
  }, []);

  React.useEffect(() => {
    push({ search: qs.stringify({ sort: 'name:ASC' }, { encode: false }) });
  }, [push]);

  const headers = tableHeaders.map((header) => ({
    ...header,
    metadatas: {
      ...header.metadatas,
      label: formatMessage(header.metadatas.label),
    },
  }));

  const {
    data: transferTokens,
    status,
    isFetching,
    refetch,
  } = useQuery(
    ['transfer-tokens'],
    async () => {
      trackUsage('willAccessTokenList', {
        tokenType: TRANSFER_TOKEN_TYPE,
      });
      const {
        data: { data },
      } = await get(`/admin/transfer/tokens`);

      trackUsage('didAccessTokenList', { number: data.length, tokenType: TRANSFER_TOKEN_TYPE });

      return data;
    },
    {
      enabled: canRead,
      onError(err) {
        if (err instanceof AxiosError) {
          if (err?.response?.data?.error?.details?.code === 'INVALID_TOKEN_SALT') {
            toggleNotification({
              type: 'warning',
              message: {
                id: 'notification.error.invalid.configuration',
                defaultMessage:
                  'You have an invalid configuration, check your server log for more information.',
              },
            });
          } else {
            toggleNotification({
              type: 'warning',
              message: { id: 'notification.error', defaultMessage: 'An error occured' },
            });
          }
        }
      },
    }
  );

  const isLoading =
    canRead &&
    ((status !== 'success' && status !== 'error') || (status === 'success' && isFetching));

  const deleteMutation = useMutation(
    async (id: Entity.ID) => {
      await del(`/admin/transfer/tokens/${id}`);
    },
    {
      async onSuccess() {
        // @ts-expect-error this is fine
        await refetch(['transfer-tokens']);
      },
      onError(err) {
        if (err instanceof AxiosError) {
          if (err?.response?.data?.data) {
            toggleNotification({ type: 'warning', message: err.response.data.data });
          } else if (err?.response?.data?.error?.details?.code === 'INVALID_TOKEN_SALT') {
            toggleNotification({
              type: 'warning',
              message: {
                id: 'notification.error.invalid.configuration',
                defaultMessage:
                  'You have an invalid configuration, check your server log for more information.',
              },
            });
          } else {
            toggleNotification({
              type: 'warning',
              message: { id: 'notification.error', defaultMessage: 'An error occured' },
            });
          }
        }
      },
    }
  );

  const hasTransferTokens = transferTokens && transferTokens?.length > 0;
  const shouldDisplayDynamicTable = canRead && hasTransferTokens;
  const shouldDisplayNoContent = canRead && !hasTransferTokens && !canCreate;
  const shouldDisplayNoContentWithCreationButton = canRead && !hasTransferTokens && canCreate;

  return (
    <Main aria-busy={isLoading}>
      <SettingsPageTitle name="Transfer Tokens" />
      <HeaderLayout
        title={formatMessage({
          id: 'Settings.transferTokens.title',
          defaultMessage: 'Transfer Tokens',
        })}
        subtitle={formatMessage({
          id: 'Settings.transferTokens.description',
          defaultMessage: '"List of generated transfer tokens"', // TODO change this message
        })}
        primaryAction={
          canCreate ? (
            <LinkButton
              data-testid="create-transfer-token-button"
              startIcon={<Plus />}
              size="S"
              onClick={() =>
                trackUsage('willAddTokenFromList', {
                  tokenType: TRANSFER_TOKEN_TYPE,
                })
              }
              to="/settings/transfer-tokens/create"
            >
              {formatMessage({
                id: 'Settings.transferTokens.create',
                defaultMessage: 'Create new Transfer Token',
              })}
            </LinkButton>
          ) : undefined
        }
      />
      <ContentLayout>
        {!canRead && <NoPermissions />}
        {shouldDisplayDynamicTable && (
          <Table
            permissions={{ canRead, canDelete, canUpdate }}
            headers={headers}
            contentType="trasfer-tokens"
            isLoading={isLoading}
            onConfirmDelete={(id) => deleteMutation.mutateAsync(id)}
            tokens={transferTokens}
            tokenType={TRANSFER_TOKEN_TYPE}
          />
        )}
        {shouldDisplayNoContentWithCreationButton && (
          <NoContent
            content={{
              id: 'Settings.transferTokens.addFirstToken',
              defaultMessage: 'Add your first Transfer Token',
            }}
            action={
              <LinkButton
                variant="secondary"
                startIcon={<Plus />}
                to="/settings/transfer-tokens/create"
              >
                {formatMessage({
                  id: 'Settings.transferTokens.addNewToken',
                  defaultMessage: 'Add new Transfer Token',
                })}
              </LinkButton>
            }
          />
        )}
        {shouldDisplayNoContent && (
          <NoContent
            content={{
              id: 'Settings.transferTokens.emptyStateLayout',
              defaultMessage: 'You don’t have any content yet...',
            }}
          />
        )}
      </ContentLayout>
    </Main>
  );
};

/* -------------------------------------------------------------------------------------------------
 * ProtectedListView
 * -----------------------------------------------------------------------------------------------*/

const ProtectedListView = () => {
  const permissions = useSelector(selectAdminPermissions);

  return (
    <CheckPagePermissions permissions={permissions.settings?.['transfer-tokens'].main}>
      <ListView />
    </CheckPagePermissions>
  );
};

export { ListView, ProtectedListView };
