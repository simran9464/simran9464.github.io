import { addColumnToTableHook } from '../listView';

describe('addColumnToTableHook', () => {
  it('does nothing when there s no i18n.localized key in the action', () => {
    const displayedHeaders = ['one'];
    const layout = {
      components: {},
      contentType: { pluginOptions: {} },
    };

    // @ts-expect-error – test purpose
    const result = addColumnToTableHook({ displayedHeaders, layout });

    expect(result).toHaveProperty('displayedHeaders');
    expect(result).toHaveProperty('layout');
    expect(result.displayedHeaders).toHaveLength(1);
    expect(result.displayedHeaders).toEqual(['one']);
  });

  it('adds a header to the displayedHeaders array when the content type is localized', () => {
    const displayedHeaders: unknown[] = [];
    const layout = {
      components: {},
      contentType: {
        pluginOptions: {
          i18n: { localized: true },
        },
      },
    };

    // @ts-expect-error – test purpose
    const result = addColumnToTableHook({ displayedHeaders, layout });

    // The anonymous function of cellFormatter creates problem, because it's anonymous
    // In our scenario, it's even more tricky because we use a closure in order to pass
    // the locales.
    // Stringifying the action allows us to have a name inside the expectation for the "cellFormatter" key
    expect(JSON.stringify(result.displayedHeaders)).toBe(
      '[{"key":"__locale_key__","fieldSchema":{"type":"string"},"metadatas":{"label":"Content available in","searchable":false,"sortable":false},"name":"locales"}]'
    );
  });
});
