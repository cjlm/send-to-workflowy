import React from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Link,
  ButtonGroup,
  IconButton,
  Input,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';

import SensitiveInput from './SensitiveInput';

export default function SettingsForm(props) {
  const {
    bindSessionId,
    bindParentId,
    bindSharedNode,
    mode,
    setMode,
    top,
    setTop,
  } = props;

  const tabs = ['simple', 'advanced'];

  const handleSubmit = async (evt) => {
    evt.preventDefault();
  };

  const handleTabsChange = (index) => {
    setMode(tabs[index]);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Tabs
          size="sm"
          variant="soft-rounded"
          index={tabs.indexOf(mode)}
          onChange={handleTabsChange}
        >
          <TabList>
            <Tab>Simple</Tab>
            <Tab>Advanced</Tab>
          </TabList>{' '}
          <TabPanels>
            <TabPanel>
              <FormControl id="shared-node-url">
                <FormLabel>Shared node:</FormLabel>
                <Input type="text" fontSize="0.9em" {...bindSharedNode} />
                <FormHelperText>
                  Provide the URL of a shared WorkFlowy node.
                </FormHelperText>
              </FormControl>
            </TabPanel>
            <TabPanel>
              <FormControl id="session-id" mt="4">
                <FormLabel>Session ID:</FormLabel>
                <SensitiveInput {...bindSessionId} />
                <FormHelperText>
                  Required to send to your WorkFlowy.
                </FormHelperText>
              </FormControl>
              <FormControl id="parent-id" mt="4">
                <FormLabel>Parent ID:</FormLabel>
                <Input type="text" fontSize="0.9em" {...bindParentId} />
                <FormHelperText>
                  The location to send to in WorkFlowy.
                </FormHelperText>
              </FormControl>
            </TabPanel>
          </TabPanels>
          <FormControl id="priority" ml="4" mr="4">
            <FormLabel>Add new item to top or bottom:</FormLabel>
          </FormControl>
          <ButtonGroup size="sm" isAttached variant="outline" mr="4" ml="4">
            <IconButton
              aria-label="Add to top"
              icon={<ArrowUpIcon />}
              isActive={top}
              onClick={() => {
                setTop(true);
              }}
            />
            <IconButton
              aria-label="Add to bottom"
              icon={<ArrowDownIcon />}
              isActive={!top}
              onClick={() => {
                setTop(false);
              }}
            />
          </ButtonGroup>
          <Text mt="4" mb="4" fontSize="sm">
            Check the{' '}
            <Link
              textDecorationLine={'underline'}
              href="https://github.com/cjlm/send-to-workflowy#configuration"
            >
              docs
            </Link>{' '}
            for more info on these settings.
          </Text>
        </Tabs>
      </form>
    </>
  );
}
