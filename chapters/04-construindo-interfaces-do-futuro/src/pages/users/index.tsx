import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react";
import { RiAddLine, RiPencilLine, RiRefreshLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

import { useUsers, getUsers } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserListProps {
  users: User[];
  totalCount: number;
}

export default function UserList({ users, totalCount }: UserListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, error, isFetching } = useUsers(page, {
    initialData: {
      users,
      totalCount
    }
  });

  const isWideVersion = useBreakpointValue<boolean>({
    base: false,
    lg: true
  });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(
      ["users", userId],
      async () => {
        const response = await api.get(`users/${userId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10 // 10 minutos
      }
    );
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            <Flex>
              <Tooltip label="Atualizar">
                <Button
                  size="sm"
                  fontSize="sm"
                  bgColor="gray.700"
                  cursor="pointer"
                  onClick={() => refetch()}
                >
                  <Icon as={RiRefreshLine} fontSize={20} />
                </Button>
              </Tooltip>
              <NextLink href="/users/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="pink"
                  ml="4"
                  leftIcon={<Icon as={RiAddLine} fontSize={20} />}
                  cursor="pointer"
                >
                  Criar novo usuário
                </Button>
              </NextLink>
            </Flex>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários.</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" w="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    <Th width="8" />
                  </Tr>
                </Thead>
                <Tbody>
                  {data.users.map(item => (
                    <Tr key={item.id}>
                      <Td px={["4", "4", "6"]}>
                        <Checkbox colorScheme="pink" />
                      </Td>
                      <Td>
                        <Box>
                          <Link
                            color="purple.400"
                            onMouseEnter={() => handlePrefetchUser(item.id)}
                          >
                            <Text fontWeight="bold">{item.name}</Text>
                          </Link>
                          <Text fontSize="sm" color="gray.300">
                            {item.email}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{item.createdAt}</Td>}
                      <Td>
                        {isWideVersion && (
                          <Button
                            as="a"
                            size="sm"
                            fontSize="sm"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize={16} />}
                            cursor="pointer"
                          >
                            Editar usuário
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination
                registersPerPage={10}
                onPageChange={setPage}
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
              />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { users, totalCount } = await getUsers(1);

  return {
    props: {
      users
    }
  };
};
