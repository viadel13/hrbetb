import { Box, Stack, Typography, styled, Select, MenuItem, Grid, TableContainer, Table, TableHead, TableRow, TableCell, Checkbox, CircularProgress } from '@mui/material'
import { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import Card from '../Card/Index';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { datasDetailHead } from '../../datas/datasDetailHead';
import TableEmployment from '../TableEmployment/Index';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { menuActif } from '../../redux/reducers/rootReducer';
import Loader from '../Load/Index';
import { Icon } from '@iconify/react';


const DetailUser = () => {
  const [load, setLoad] = useState(true);
  const currentYear = new Date().getFullYear();
  const [selectDate, setSelectDate] = useState(currentYear);
  const [reload, setReload] = useState(false);
  const [reloadCardInfos, setReloadCardInfos] = useState(false);
  const [loadCardInfos, setLoadCardInfos] = useState(true);
  const [datasDetailUser, setDatasDetailUser] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [nbreConges, setNbreConges] = useState('');
  const [nbreAbscence, setNbreAbscence] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const dispatch = useDispatch();



  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);



  useLayoutEffect(() => {
    dispatch(menuActif(1));
  }, [dispatch]);

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
    if (!state) {
      navigate('/employes');
    }
  }, [state, navigate]);

  //recupere les documents
  useEffect(() => {
    const fetchDetailUser = async () => {
      setLoad(true);

      const startOfYear = new Date(selectDate, 0, 1);
      const endOfYear = new Date(selectDate, 11, 31, 23, 59, 59);

      const q = query(
        collection(db, 'conges'),
        where('matricule', '==', state.matricule),
        where('dateDebut', '>=', startOfYear),
        where('dateDebut', '<=', endOfYear)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newDocs = [];
        querySnapshot.forEach((doc) => {
          newDocs.push(doc.data());
        });
        setDatasDetailUser(newDocs);
        setLoad(false);
      });

      setReload(false);
      return () => {
        unsubscribe();
      };
    };

    fetchDetailUser();
  }, [setReload, selectDate]);


  useEffect(() => {
    fetchDocuments()
    setReloadCardInfos(false)
  }, [selectDate, setReloadCardInfos])

  const excludedDays = [
    '02-11',
    '05-01',
    '05-20',
    '08-15',
    '12-25',

  ];


  const isExcludedDay = (date) => {
    const dayMonth = ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2); // Extrait MM-DD
    return date.getDay() === 0 || excludedDays.includes(dayMonth);
  };

  const calculateDiffDaysIgnoringExcludedDays = (startDate, endDate) => {
    let currentDate = new Date(startDate);
    let count = 0;


    while (currentDate <= endDate) {
      if (!isExcludedDay(currentDate)) {
        count++;
      } else {

      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  };

  const fetchDocuments = async () => {
    setLoadCardInfos(true);
    try {
      const startOfYear = new Date(selectDate, 0, 1);
      const endOfYear = new Date(selectDate, 11, 31, 23, 59, 59);

      const q = query(
        collection(db, 'conges'),
        where('matricule', '==', state.matricule),
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
            autresAbsences: 0,
          };
        }

        const dateDebut = data.dateDebut.toDate();
        const dateFin = data.dateFin.toDate();
        
        
        const adjustedDiffDays = calculateDiffDaysIgnoringExcludedDays(dateDebut, dateFin);

        if (data.typeAbscence === 'Congés payé') {
          aggregatedData[matricule].conges += adjustedDiffDays;

        } else {
          aggregatedData[matricule].autresAbsences += adjustedDiffDays;
        }



      });
      const nbreCongesForMatricule = aggregatedData[state.matricule]?.conges || 0;
      const nbreAbscencesForMatricule = aggregatedData[state.matricule]?.autresAbsences || 0;
      setNbreConges(nbreCongesForMatricule);
      setNbreAbscence(nbreAbscencesForMatricule);
      setLoadCardInfos(false);


    } catch (error) {
      console.error('Erreur lors de la récupération des documents :', error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(datasDetailUser.map((_, index) => index));
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  return (
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
        <>
          <Box sx={{
            px: 3,
            pt: 5,
          }}>

            <Stack spacing={1}>
              <Typography
                sx={{
                  fontSize: 16,
                  color: '#BDBDBD'
                }}
              >
                Employes <span></span>
                <Typography
                  component='span'
                  sx={{
                    fontSize: 16,
                    color: '#101214'
                  }}
                >
                  / DetailsEmployé
                </Typography>
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
                    Informations sur l’employé
                  </Typography>
                </Stack>

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
            </Stack>

          </Box>

          <Box sx={{ border: '1px solid #E6E6E6', my: 3 }} />
          {
            load ? <Loader /> : (
              <>
                <Box sx={{
                  px: 3,
                }}>

                  <Grid container rowSpacing={3} columnSpacing={2} mb={5} >
                    <Grid item xs={12} sm={6} md={4} >
                      <Stack direction='row' spacing={2}>
                        <Box sx={{
                          width: '90px',
                          height: '90px',
                          borderRadius: 999,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <img src='https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='img' style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: 999, }} />
                        </Box>
                        <Stack sx={{ justifyContent: 'space-between', display: { xs: 'none', sm: 'flex', md: 'flex' } }}>
                          <Typography sx={{ fontSize: '18px', color: '#101214', fontWeight: 'bold' }}>{state.nom}</Typography>
                          <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Poste

                            <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>{state.poste}</Typography>
                          </Typography>

                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={8} sx={{}} >
                      <Box sx={{ display: 'flex', height: '100%', }}>

                        <Stack
                          sx={{
                            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'flex-start', md: 'flex-end' },
                            gap: { xs: 2, sm: 0, md: 10 }
                          }} >
                          <Stack sx={{ justifyContent: 'space-between', display: { xs: 'flex', sm: 'none', md: 'none' } }}>
                            <Typography sx={{ fontSize: '18px', color: '#101214', fontWeight: 'bold' }}>{state.nom}</Typography>
                            <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Poste

                              <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>{state.poste}</Typography>
                            </Typography>

                          </Stack>
                          <Stack>
                            <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Téléphone</Typography>
                            <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>{state.telephone}</Typography>
                          </Stack>
                          <Stack>
                            <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Adresse email</Typography>
                            <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>{state.email}</Typography>
                          </Stack>

                        </Stack>
                      </Box>
                    </Grid>
                    {/* 
                    {
                      datasCard.map((i, index) => {
                        return (
                          <Fragment key={index}>
                            <Grid item xs={12} sm={6} md={3} sx={{}}>
                              <Card
                                icon={i.icone}
                                name={state.departement}
                                downName={i.downName}
                              />
                            </Grid>
                          </Fragment>
                        )
                      })
                    } */}
                    <Grid item xs={12} sm={6} md={3} >
                      <Card
                        icon={<Icon icon="mdi:microsoft-office" fontSize={25} />}
                        name={state.departement}
                        downName="Département"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} >
                      <Card
                        icon={<Icon icon="solar:calendar-linear" fontSize={25} />}
                        name={nbreConges !== '' ? `${nbreConges}` : <CircularProgress size={18} sx={{ color: 'white', }} />}
                        downName="Congés Pris"
                        maxConges={25}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} >
                      <Card
                        icon={<Icon icon="solar:logout-outline" fontSize={25} />}
                        name={nbreAbscence !== '' ? `${nbreAbscence}` : <CircularProgress size={18} sx={{ color: 'white', }} />}
                        downName="Autres abscences"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} >
                      <Card
                        icon={<Icon icon="majesticons:award-line" fontSize={25} />}
                        name="Observation"
                        downName="Comportement"
                      />
                    </Grid>

                  </Grid>

                </Box>

                <Box sx={{
                  px: 3,
                  mb: 12,
                }}>
                  <TableContainer sx={{ minWidth: '100%', mt: 2, whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#FF3F25', borderRadius: '8px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#FF5733' }, '&::-webkit-scrollbar-track': { backgroundColor: '#F0F0F0', borderRadius: '8px' } }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#F9F9F9" }}>
                          {/* <TableCell padding="checkbox">
                              <Checkbox
                                indeterminate={selectedRows.length > 0 && selectedRows.length < datasDetailUser.length}
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                            </TableCell> 
                        */}
                          {

                            datasDetailHead.head.map((i, index) => {
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
                      {datasDetailUser.length > 0 && (
                        <TableEmployment
                          datasTab={datasDetailUser}
                          nameTab="datasDetailUser"
                          selectedRows={selectedRows}
                          setSelectedRows={setSelectedRows}
                          setSelectAll={setSelectAll}
                        />
                      )}
                    </Table>
                  </TableContainer>

                </Box>
              </>
            )
          }

        </>
      </Box>
    </Box>

  )
}

export default DetailUser
