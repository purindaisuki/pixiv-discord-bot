const illustProerties = [
  "id",
  "title",
  "type",
  "image_urls.square_medium",
  "image_urls.medium",
  "image_urls.large",
  "caption",
  "restrict",
  "user.id",
  "user.name",
  "user.account",
  "user.profile_image_urls.medium",
  "user.is_followed",
  "tags",
  "tools",
  "create_date",
  "page_count",
  "width",
  "height",
  "sanity_level",
  "x_restrict",
  "series",
  "meta_single_page",
  "meta_pages",
  "total_view",
  "total_bookmarks",
  "is_bookmarked",
  "visible",
  "is_muted",
];
const tagProperties = ["tag", "translated_name", "illust"];

const hasProperties = (received: unknown, properties: string[]) => {
  if (typeof received !== "object") {
    return { pass: false };
  }

  let hasNoProp = "";
  const pass = properties.every((prop) => {
    const nestedProps = prop.split(".");
    let obj = received;

    return nestedProps.every((nestedProp) => {
      hasNoProp = `${prop}: ${nestedProp}`;

      if (!obj?.hasOwnProperty(nestedProp)) {
        return false;
      }

      obj = obj[nestedProp as keyof typeof obj];
      return true;
    });
  });

  return { pass, hasNoProp };
};

expect.extend({
  toBeIllust(received: unknown) {
    const { pass, hasNoProp } = hasProperties(received, illustProerties);

    return {
      pass,
      message: () =>
        `Expected ${received} has ${hasNoProp ?? illustProerties[0]} property.`,
    };
  },
  toBeIllustArray(received: unknown) {
    if (!Array.isArray(received)) {
      return {
        message: () =>
          `Expected ${received} to be a valid illustrations array.`,
        pass: false,
      };
    }

    let hasNoProp: string | undefined;
    let index: number;
    const pass = received.every((receivedElement, ind) => {
      const { pass, hasNoProp: elementHasNoProp } = hasProperties(
        receivedElement,
        illustProerties
      );

      index = ind;
      hasNoProp = elementHasNoProp;

      return pass;
    });

    return {
      pass,
      message: () =>
        `Expected ${received}[${index}] has ${
          hasNoProp ?? illustProerties[0]
        } property.`,
    };
  },
  toBeTagArray(received: unknown) {
    if (!Array.isArray(received)) {
      return {
        pass: false,
        message: () => `Expected ${received} to be a valid tags array.`,
      };
    }

    let hasNoProp: string;
    let index: number;
    const pass = received.every((receivedElement, ind) => {
      const { pass: elementPassTag, hasNoProp: elementHasNoTagProp } =
        hasProperties(receivedElement, tagProperties);

      if (!elementPassTag) {
        hasNoProp = elementHasNoTagProp ?? tagProperties[0];

        return false;
      }

      const { pass, hasNoProp: elementHasNoProp } = hasProperties(
        receivedElement.illust,
        illustProerties
      );

      index = ind;
      hasNoProp = elementHasNoProp ?? illustProerties[0];

      return pass;
    });

    return {
      pass,
      message: () =>
        `Expected ${received}[${index}] has ${hasNoProp} property.`,
    };
  },
});
