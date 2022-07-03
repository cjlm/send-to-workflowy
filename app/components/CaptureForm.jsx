import React, { useState } from 'react';

import useInput from '../hooks/useInput';
import useLocalStorage from '../hooks/useLocalStorage';
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

import { Button, CircularProgress, Checkbox } from '@chakra-ui/react';
import { Input, Textarea, Box, Collapse } from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';

export default function CaptureForm(props) {
  const { parentId, sessionId, mode, sharedNode, top } = props;

  const priority = top ? 0 : 10000000;

  const { value: text, bind: bindText, reset: resetText } = useInput('');
  const { value: note, bind: bindNote, reset: resetNote } = useInput('');

  const [status, setStatus] = useState('');

  const [isNoteShown, toggleNote] = useLocalStorage('notes', false);

  const toast = useToast();

  const showToast = (text, status) => {
    toast({
      title: text,
      description: '',
      status,
      isClosable: false,
      duration: 4000,
      position: 'bottom',
    });
  };

  const keyboardSubmit = (evt) => {
    if (evt.keyCode === 13 && (evt.ctrlKey || evt.metaKey)) {
      handleSubmit(evt);
    }
  };

  const doFetch = async (options) => {
    const { sessionId, parentId, sharedNode, mode } = options;

    let body = { text, note, priority, mode };

    if (mode === 'simple') {
      body.url = sharedNode;
    } else if (mode === 'advanced') {
      body = { ...body, sessionId, parentId };
    }

    return fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setStatus('loading');

    if (mode === 'simple' && !sharedNode) {
      setStatus('error');
      showToast(
        'No Workflowy shared node provided, please check your configuration',
        'error'
      );
      return;
    }

    try {
      const response = await doFetch({
        text,
        note,
        sessionId,
        parentId,
        priority,
        sharedNode,
        mode,
      });
      if (response.ok) {
        setStatus('success');

        resetText();
        resetNote();

        showToast('Sent!', 'success');
      } else {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      showToast(
        'Error connecting to WorkFlowy, please check your configuration.',
        'error'
      );
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl id="text" mt="4">
          <FormLabel>Text:</FormLabel>
          <Textarea
            autoFocus
            type="text"
            onKeyDown={keyboardSubmit}
            {...bindText}
          />
          <FormHelperText>Text to go in your new WorkFlowy node</FormHelperText>
        </FormControl>

        <FormControl id="note" mt="4">
          <Checkbox
            isChecked={isNoteShown}
            onChange={() => {
              toggleNote((open) => !open);
            }}
            size="sm"
          >
            {`Include Note${isNoteShown ? ':' : ''}`}
          </Checkbox>
          <Collapse in={isNoteShown} animateOpacity>
            <Textarea type="text" onKeyDown={keyboardSubmit} {...bindNote} />
          </Collapse>
        </FormControl>

        <Button
          width="full"
          mt={4}
          variantcolor="#597e8d"
          variant="outline"
          type="submit"
          value="Submit"
        >
          {status === 'loading' ? (
            <CircularProgress isIndeterminate size="24px" color="teal" />
          ) : (
            'Send'
          )}
        </Button>
      </form>
    </>
  );
}
