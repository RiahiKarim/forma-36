import React from 'react';
import { Subheading, Paragraph, TextLink } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

const styles = {
  resource: css`
    display: flex;
  `,
  text: css`
    text-align: left;
    flex: 1;
  `,
  paragraph: css`
    font-size: ${tokens.fontSizeL};
  `,
  link: css`
    font-size: ${tokens.fontSizeL}!important;
  `,
  image: css`
    width: 80px;
    height: 80px;
    margin-right: ${tokens.spacingXl};

    img {
      display: block;
      max-width: 100%;
    }
  `,
};

export const Resource = ({
  title,
  description,
  imageNode,
  linkHref,
  linkText,
  linkExternal = true,
}: {
  title: string;
  description: string;
  imageNode: React.ReactNode;
  linkHref?: string;
  linkText?: string;
  linkExternal?: boolean;
}) => {
  const linkProps = linkExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <article className={styles.resource}>
      <div className={styles.image}>{imageNode}</div>
      <div className={styles.text}>
        <Subheading>{title}</Subheading>
        <Paragraph className={styles.paragraph}>{description}</Paragraph>
        {linkHref && linkText && (
          <Paragraph className={styles.paragraph}>
            <TextLink className={styles.link} href={linkHref} {...linkProps}>
              {linkText}
            </TextLink>
          </Paragraph>
        )}
      </div>
    </article>
  );
};
