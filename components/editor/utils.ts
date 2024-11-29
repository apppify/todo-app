export const make = (
  tagName: keyof HTMLElementTagNameMap,
  classNames: string | (string | undefined)[] | null = null,
  attributes: object = {}
): HTMLElement => {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    const validClassnames = classNames.filter((className) => className !== undefined) as string[];

    el.classList.add(...validClassnames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  // for (const attrName in attributes) {
  //   if (Object.prototype.hasOwnProperty.call(attributes, attrName)) {
  //     el[attrName] = attributes[attrName];
  //   }
  // }

  return el;
};
