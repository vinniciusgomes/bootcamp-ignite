import { Flex, Text, Box, Avatar } from '@chakra-ui/react'

interface ProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align='center'>
      {showProfileData && (
        <Box
          mr='4'
          textAlign='right'
        >
          <Text>Vinnicius Gomes</Text>
          <Text color='gray.300' fontSize='small'>
            hello@vinniciusgomes.dev
          </Text>
        </Box>
      )}

      <Avatar size='md' name='Vinnicius Gomes' src='https://github.com/vinniciusgomes.png' />
    </Flex>
  )
}