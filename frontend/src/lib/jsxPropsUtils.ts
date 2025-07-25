// Extracts props from a simple JSX string (root element only, ignores comments and container divs)
export function extractPropsFromJsx(jsx: string): Record<string, any> {
  // Find the first real element (button, input, etc.)
  const match = jsx.match(/<(button|input|textarea|select|a|span|h[1-6]|p|label|img|svg|div)([^>]*)>([\s\S]*?)<\/(button|input|textarea|select|a|span|h[1-6]|p|label|img|svg|div)>/);
  if (!match) return {};
  const [ , tag, rawProps, children ] = match;
  const props: Record<string, any> = { _tag: tag };
  // Extract style (e.g., style={{ color: '#fff', fontSize: 16 }})
  const styleMatch = rawProps.match(/style={{([^}}]+)}}/);
  if (styleMatch) {
    styleMatch[1].split(',').forEach(pair => {
      const [k, v] = pair.split(':').map(s => s.trim());
      if (k && v) {
        if (v.startsWith("'")) props[k] = v.replace(/'/g, '');
        else if (!isNaN(Number(v))) props[k] = Number(v);
        else props[k] = v;
      }
    });
  }
  // Extract text content, ignore comments
  if (children && !children.trim().startsWith('/*')) {
    props.text = children.trim();
  }
  return props;
}

// Updates a simple JSX string with new props (root element only)
export function updateJsxWithProps(jsx: string, newProps: Record<string, any>): string {
  const match = jsx.match(/<([a-zA-Z0-9]+)([^>]*)>([\s\S]*?)<\/[a-zA-Z0-9]+>/);
  if (!match) return jsx;
  const [full, tag, rawProps] = match;
  // Build new style string
  const styleProps = [
    newProps.color ? `color: '${newProps.color}'` : '',
    newProps.size ? `fontSize: ${newProps.size}` : ''
  ].filter(Boolean).join(', ');
  const styleString = styleProps ? ` style={{ ${styleProps} }}` : '';
  // Replace text content
  const newText = newProps.text || '';
  return `<${tag}${styleString}>${newText}</${tag}>`;
} 