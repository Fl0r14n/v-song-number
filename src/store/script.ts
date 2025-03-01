export const loadScript = (props: { src: string; attrs?: Record<string, string>; el?: Element }) =>
  new Promise((resolve, reject) => {
    if (!import.meta.env.SSR) {
      const script = document.createElement('script')
      const { attrs } = props
      if (attrs)
        Object.keys(attrs).forEach(
          key => (key.startsWith('data-') && script.setAttribute(key, attrs[key])) || ((script as any)[key] = attrs[key])
        )
      script.addEventListener('load', resolve)
      script.addEventListener('error', reject)
      script.src = props.src
      script.async = true
      script.defer = true
      if (props.el) {
        props.el.appendChild(script)
      } else {
        document.body.appendChild(script)
      }
    }
  })
