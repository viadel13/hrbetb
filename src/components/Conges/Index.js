import { Box, Grid, IconButton, MenuItem, Select, Stack, Table, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { datasCongesHeadEmployes } from '../../datas/datasCongesHeadEmployes';
import { Suspense, lazy, useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import Loader from '../Load/Index';
const TableEmployment = lazy(() => import('../TableEmployment/Index'));

const Conges = () => {

  const [load, setLoad] = useState(true);
  const [reload, setReload] = useState(false);
  const [datasConges, setDatasConges] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectDate, setSelectDate] = useState(currentYear);


  useEffect(() => {  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []); 

  
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
  const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: 'white',
    width: 158,
    height: 44,
    padding: '10px 18px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    '.MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    '.MuiOutlinedInput-input': {
      padding: '10px 18px',
    }
  }));

  const generateYears = (startYear, numberOfYears) => {
    const years = [];
    for (let i = 0; i <= numberOfYears; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  const years = generateYears(currentYear, 3);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      const startOfYear = new Date(selectDate, 0, 1);
      const endOfYear = new Date(selectDate, 11, 31, 23, 59, 59);

      const q = query(
        collection(db, 'conges'),
        where('dateDebut', '>=', startOfYear),
        where('dateDebut', '<=', endOfYear)
      );

      const querySnapshot = await getDocs(q);
      const aggregatedData = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const matricule = data.matricule;

        if (!aggregatedData[matricule]) {
          aggregatedData[matricule] = {
            employe: `${data.employe}`,
            matricule: data.matricule,
            conges: 0,
            autresAbsences: 0
          };
        }

        const dateDebut = data.dateDebut.toDate();
        const dateFin = data.dateFin.toDate();
        const diffTime = Math.abs(dateFin - dateDebut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (data.typeAbscence === 'Congés payé') {
          aggregatedData[matricule].conges += diffDays;
        } else {
          aggregatedData[matricule].autresAbsences += diffDays;
        }
      });

      setDatasConges(Object.values(aggregatedData));
      setLoad(false);
    };

    fetchData();
    setReload(false);
  }, [reload, selectDate]);


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(datasConges.map((_, index) => index));
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };



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
                Congés
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
                    Liste des congés de Betb
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} sx={{ alignItems: 'flex-end', display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-start', md: 'flex-end' } }}>
            <Stack direction="row" spacing={2}>
              <NavLink to="addConges" style={{ textDecoration: 'none', color: '#101214' }}>
                <StyledBoxNav>
                  <Icon icon="fluent:add-20-regular" />
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
              <StyledSelect
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                size='small'
                value={selectDate}
                onChange={(event) => {
                  setSelectDate(event.target.value);
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      boxShadow: '0px 1px 3px 0px #BDBDBD',
                      border: '1px solid #E0E0E0',
                    },
                  },
                }}
              >

                {years.map((year) => (
                  <MenuItem key={year} value={year} sx={{ color: '#101214' }}>
                    {year}
                  </MenuItem>
                ))}
              </StyledSelect>
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
                      {
                        datasCongesHeadEmployes.head.map((i, index) => {
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
            </Suspense>
          )}
      </Box>

    </>
  )
}

export default Conges
