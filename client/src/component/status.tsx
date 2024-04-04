import { Box, Button, CircularProgress } from "@chakra-ui/react";
const Online = () => {
  return (
    <>
      <Button colorScheme="green">Online</Button>
    </>
  );
};
const Connecting = () => {
  return (
    <>
      <Box>
        <CircularProgress isIndeterminate color="#FFD6E2" />{" "}
        <Button colorScheme="blue">Connecting</Button>
      </Box>
    </>
  );
};
export { Online, Connecting };
