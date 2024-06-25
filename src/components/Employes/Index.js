import { Box, Checkbox, Grid, IconButton, Stack, Table, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from '@mui/material';

import add from '../../assets/images/add.svg';
// import TableEmployment from '../TableEmployment/Index';
import { datasHeadUsers } from '../../datas/datasHeadUsers';
import { Suspense, lazy, useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { NavLink } from 'react-router-dom';
import Loader from '../Load/Index';
const TableEmployment = lazy(() => import('../TableEmployment/Index'));


const Employes = () => {
  const [load, setLoad] = useState(true);
  const [reload, setReload] = useState(false);
  const [datasEmployes, setDatasEmployes] = useState([]);
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
      setDatasEmployes(Object.values(newDocs));
      setLoad(false);
    });
    setReload(false);
    return () => {
      unsubscribe();
    };
  }, [reload]);


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(datasEmployes.map((_, index) => index));
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };



  const StyledBoxNav = styled(IconButton)(({ theme }) => ({

    backgroundColor: '#101214',
    width: 'auto',
    height: '45px',
    borderRadius: '24px',
    padding: '10px 18px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    color: 'white',
    '&:hover': {
      backgroundColor: '#101214',
    },

  }));



  return (
    <>

      <Box sx={{
        px: 3,
        pt: 5,
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <Stack spacing={1}>
              <Typography
                sx={{
                  fontSize: 16,
                  color: '#BDBDBD'
                }}
              >
                Employes
              </Typography>
              <Stack direction="row" spacing={2} alignItems='center' flex={1} justifyContent='space-between'>
                <Stack direction="row" spacing={1} alignItems='center'>
                  <Box sx={{
                    backgroundColor: '#FF3F25',
                    width: 6,
                    height: 24,
                    borderRadius: 12
                  }}>

                  </Box>
                  <Typography
                    sx={{
                      fontSize: { xs: 17, sm: 24 },
                      color: '#101214',
                      fontWeight: 600
                    }}
                  >
                    Liste des employés de Betb
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} sx={{ alignItems: 'flex-end', display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-start', md: 'flex-end' } }}>
            <Stack direction="row" spacing={2}>
              <NavLink to="addConges" style={{ textDecoration: 'none', color: '#101214' }}>

                <StyledBoxNav

                >
                  <img src={add} alt='add' />
                  <Typography
                    sx={{
                      fontSize: 16,
                      color: '#FFFFFF',
                      ml: 1,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Ajouter un congé
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      color: '#FFFFFF',
                      ml: 1,
                      display: { xs: 'block', sm: 'none' }
                    }}
                  >
                    congé
                  </Typography>
                </StyledBoxNav>
              </NavLink>
              <StyledBoxNav>
                <img src={add} alt='add' />
                <Typography
                  sx={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    ml: 1,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Nouveau employé
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    ml: 1,
                    display: { xs: 'block', sm: 'none' }
                  }}
                >
                  employé
                </Typography>
              </StyledBoxNav>
            </Stack>

          </Grid>
        </Grid>
      </Box>
      <Box sx={{ border: '1px solid #E6E6E6', my: 3 }} />
      <Box sx={{
        px: 3,
        mb: 10
      }}>
        {
          load ? <Loader /> : (
            <Suspense fallback={<Loader />}>

              <TableContainer sx={{ minWidth: '100%', mt: 2, whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#FF3F25', borderRadius: '8px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#FF5733' }, '&::-webkit-scrollbar-track': { backgroundColor: '#F0F0F0', borderRadius: '8px', } }}>
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
            </Suspense>
          )
        }

      </Box>

    </>

  )
}

export default Employes
