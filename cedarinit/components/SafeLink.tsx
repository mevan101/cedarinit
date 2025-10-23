import React from 'react';

interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const SafeLink: React.FC<SafeLinkProps> = ({ href, children, ...props }) => {
  const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export default SafeLink;