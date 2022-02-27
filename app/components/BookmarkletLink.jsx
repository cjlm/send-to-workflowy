import React, { useEffect, useState } from 'react';
import { Link } from '@chakra-ui/react';

import bookmarkletRaw from '/bookmarklet.min.js?raw'

export default function BookmarkletLink(props) {
  const { sessionId, parentId, children } = props;
  const [link, setLink] = useState('');

  useEffect(() => {
    setLink(
      `javascript:${bookmarkletRaw
        .replace(`!SESSION_ID`, sessionId)
        .replace(`!PARENT_ID`, parentId)
        .replace(`!URL`, `${document.URL}send`)}`
    );
  }, [sessionId, parentId]);

  return <Link href={link}>{children}</Link>;
}
