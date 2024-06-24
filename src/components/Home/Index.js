import { Box, Checkbox, Grid, Stack, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import TableEmployment from '../TableEmployment/Index';
import { datasConges, datasCongesHead } from '../../datas/datasCongesHead';
import Horaire from '../Horaire/Index';
import CardDetalUser from '../CardDetalUser/Index';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { datasHeadUsers } from '../../datas/datasHeadUsers';




const Home = () => {
  const [load, setLoad] = useState(false);
  const [datasEmployes, setDatasEmployes] = useState([]);
  const [reload, setReload] = useState(false);
  const [datasConges, setDatasConges] = useState([]);
  const [loadConges, setLoadConges] = useState("");
  const [reloadConges, setReloadConges] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);



  useEffect(() => {
    setLoad(true);
    const q = query(collection(db, "employes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newDocs = {};
      querySnapshot.forEach((doc) => {
        newDocs[doc.id] = doc.data();
      });
      setDatasEmployes(Object.values(newDocs)); // Convertir l'objet en tableau
      setLoad(false);
    });
    setReload(false);
    return () => {
      unsubscribe();
    };
  }, [reload]);

  useEffect(() => {
    setLoadConges(true);
    const q = query(collection(db, "conges"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newDocs = {};
      querySnapshot.forEach((doc) => {
        newDocs[doc.id] = doc.data();
      });
      setDatasConges(Object.values(newDocs));
      setLoadConges(false);
    });
    setReloadConges(false);
    return () => {
      unsubscribe();
    };
  }, [reloadConges]);



  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(datasEmployes.map((_, index) => index));
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };



  return (
    <>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          backgroundColor: '#F9F9F9'
        }}
      >
        <Box component='div' sx={{
          flexGrow: 1,
          backgroundColor: "#FFFFFF",
          mx: 2,
          borderRadius: '30px 30px 0 0'
        }}>
          <Box sx={{
            px: 3,
            pt: 5,
          }}>

            <Stack gap={1}>
              <Typography
                sx={{
                  fontSize: 16,
                  color: '#BDBDBD'
                }}
              >
                Dashboard
              </Typography>
              <Stack direction="row" gap={1} alignItems='center'>
                <Box sx={{
                  backgroundColor: '#FF3F25',
                  width: 6,
                  height: 24,
                  borderRadius: 12
                }}>

                </Box>
                <Typography
                  sx={{
                    fontSize: 24,
                    color: '#101214',
                    fontWeight: 600
                  }}
                >
                  Welcome Back Betb
                </Typography>

              </Stack>
            </Stack>

          </Box>
          <Box sx={{ border: '1px solid #E6E6E6', my: 3 }} />

          <Box sx={{
            px: 3,
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={5}>
                <Stack spacing={2}>

                  <Horaire />

                  <Stack direction='row' spacing={2}>
                    <CardDetalUser
                      icon={<Icon icon="solar:users-group-two-rounded-outline" fontSize={20} />}
                      text='Employés total'
                      nbre='06'
                    />
                    <CardDetalUser
                      icon={<Icon icon="solar:calendar-linear" fontSize={20} />}
                      text='Abscences totales'
                      nbre='150'
                    />
                  </Stack>

                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={7} sx={{ alignSelf: 'flex-start' }}>
                <Box sx={{
                  border: "1px solid #E6E6E6",
                  width: '100%',
                  height: "300px",
                  borderRadius: "16px",
                  p: 2,

                }}>
                  <Typography sx={{ fontSize: '20px', fontWeight: "bold" }}>
                    Congés des employés
                  </Typography>
                  <TableContainer sx={{ minWidth: '100%', mt: 2, whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#FF3F25', borderRadius: '8px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#FF5733' }, '&::-webkit-scrollbar-track': { backgroundColor: '#F0F0F0', borderRadius: '8px' } }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#F9F9F9" }}>
                  
                          {
                            datasCongesHead.head.map((i, index) => {
                              return (
                                <TableCell key={index}>
                                  <Stack direction='row' alignItems="center" spacing={2}>
                                    <Typography sx={{ color: '#101214', fontWeight: "bold" }}>{i.name}</Typography>
                                    <img src={i.icone} alt={i.name} width={6} height={10} />
                                  </Stack>
                                </TableCell>
                              )
                            })
                          }
                        </TableRow>
                      </TableHead>
                      {datasConges.length > 0 && (
                        <TableEmployment
                          datasTab={datasConges}
                          nameTab="datasConges"
                          selectedRows={selectedRows}
                          setSelectedRows={setSelectedRows}
                          setSelectAll={setSelectAll}
                        />
                      )}
                    </Table>
                  </TableContainer>
                  {/* 
                  <TableEmployment
                    datasTab={datasConges}
                    nameTab="datasConges"
                  /> */}
                </Box>
              </Grid>
            </Grid>


            <Box sx={{
              border: "1px solid #E6E6E6",
              width: '100%',
              height: "300px",
              borderRadius: "16px",
              mb: 12,
              p: 2,
              mt: 2,

            }}>
              <Stack direction='row' justifyContent="space-between">

                <Typography sx={{ fontSize: '20px', fontWeight: "bold" }}>
                  Liste des employés
                </Typography>
                <NavLink to="/employes" style={{ textDecoration: 'none' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: "bold", color: "#FF3F25" }}>
                    Voir plus
                  </Typography>
                </NavLink>

              </Stack>
              <TableContainer sx={{ minWidth: '100%', mt: 2, whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#FF3F25', borderRadius: '8px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#FF5733' }, '&::-webkit-scrollbar-track': { backgroundColor: '#F0F0F0', borderRadius: '8px' } }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F9F9F9" }}>
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedRows.length > 0 && selectedRows.length < datasEmployes.length}
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />

                      </TableCell> */}
                      {
                        datasHeadUsers.head.map((i, index) => {
                          return (
                            <TableCell key={index}>
                              <Stack direction='row' alignItems="center" spacing={2}>
                                <Typography sx={{ color: '#101214', fontWeight: "bold" }}>{i.name}</Typography>
                                <img src={i.icone} alt={i.name} width={6} height={10} />
                              </Stack>
                            </TableCell>
                          )
                        })

                      }
                    </TableRow>

                  </TableHead>
                  {datasEmployes.length > 0 && (
                    <TableEmployment
                      datasTab={datasEmployes}
                      nameTab="datasEmployes"
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows}
                      setSelectAll={setSelectAll}
                    />
                  )}
                </Table>
              </TableContainer>


            </Box>
          </Box>
        </Box>

      </Box>

    </>
  );
}

export default Home;
