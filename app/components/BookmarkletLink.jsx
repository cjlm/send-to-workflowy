import React, { useEffect, useState } from 'react';
import { Link } from '@chakra-ui/react';

import bookmarkletRaw from '/bookmarklet.min.js?raw';

export default function BookmarkletLink(props) {
  const { sessionId, parentId, sharedNode, mode, children } = props;
  const [link, setLink] = useState('');

  useEffect(() => {
    setLink(
      `javascript:${bookmarkletRaw
        .replace(`!SESSION_ID`, sessionId)
        .replace(`!PARENT_ID`, parentId)
        .replace(`!SHARED_NODE`, sharedNode)
        .replace(`!MODE`, mode)
        .replace(`!URL`, `${document.URL}send`)}`
    );
  }, [sessionId, parentId, sharedNode, mode]);

  return <Link href={link}>{children}</Link>;
}
