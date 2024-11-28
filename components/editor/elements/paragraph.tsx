import React, { memo } from 'react';

import { ELementWrapper } from './element-wrapper';

export const Paragraph = memo(() => {
  return (
    <ELementWrapper>
      <p contentEditable />
    </ELementWrapper>
  );
});
