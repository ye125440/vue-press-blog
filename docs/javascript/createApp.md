---
title: createApp

---

# createApp

```tsx
const app = ensureRenderer().createApp(...args)
```

## ensureRenderer

```tsx
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}
```

## createRenderer

```tsx
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
```

## baseCreateRenderer

```tsx
function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    cloneNode: hostCloneNode,
    insertStaticContent: hostInsertStaticContent
  } = options

  // ....此处省略两千行，我们先不管

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

## createAppAPI

```tsx
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject(rootProps)) {
      __DEV__ && warn(`root props passed to app.mount() must be an object.`)
      rootProps = null
    }

    // 创建默认APP配置
    const context = createAppContext()
    const installedPlugins = new Set()

    let isMounted = false

    const app: App = {
      _component: rootComponent as Component,
      _props: rootProps,
      _container: null,
      _context: context,

      get config() {
        return context.config
      },

      set config(v) {
        if (__DEV__) {
          warn(
            `app.config cannot be replaced. Modify individual options instead.`
          )
        }
      },

      // 都是一些眼熟的方法
      use() {},
      mixin() {},
      component() {},
      directive() {},

      // mount 我们拎出来讲
      mount() {},
      unmount() {},
      // ...
    }

    return app
  }
}
```

## createAppContext

```tsx
export function createAppContext(): AppContext {
  return {
    config: {
      isNativeTag: NO,
      devtools: true,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      isCustomElement: NO,
      errorHandler: undefined,
      warnHandler: undefined
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null)
  }
}
```

