import { Box, Checkbox, Grid, Stack, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { datasCongesHead } from '../../datas/datasCongesHead';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { Suspense, lazy, useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import Loader from '../Load/Index';
import { datasHeadUsers } from '../../datas/datasHeadUsers';
const TableEmployment = lazy(() => import('../TableEmployment/Index'));
const Horaire = lazy(() => import('../Horaire/Index'));
const CardDetalUser = lazy(() => import('../CardDetalUser/Index'));



const Home = () => {
  const [load, setLoad] = useState(true);
  const [datasEmployes, setDatasEmployes] = useState([]);
  const [reload, setReload] = useState(false);
  const [datasConges, setDatasConges] = useState([]);
  const [loadConges, setLoadConges] = useState("");
  const [reloadConges, setReloadConges] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const[nombreEmploye, setNombreEmploye] = useState(0)
  const[nombreAbscence, setNombreAbscence] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []); 


  useEffect(() => {
    setLoad(true);
    const q = query(collection(db, "employes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newDocs = {};
      let count = 0;
      querySnapshot.forEach((doc) => {
        newDocs[doc.id] = doc.data();
        count++;
      });
      setDatasEmployes(Object.values(newDocs));
      setNombreEmploye(count); 
      setLoad(false);
    });

    const qAutreAbsence = query(
      collection(db, "conges"),
      where("typeAbscence", "==", "Autre Abscence")
    );
    const unsubscribeAutreAbsence = onSnapshot(qAutreAbsence, (querySnapshot) => {
      const autreAbsenceDocs = {};
      let autreAbsenceCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.motif && data.motif !== "RAS") { // Vérification si le motif n'est pas égal à "RAS"
          autreAbsenceDocs[doc.id] = data;
          autreAbsenceCount++;
        }
      });
      setNombreAbscence(autreAbsenceCount); // Mettre à jour le nombre de documents "Autre Abscence" récupérés
    });

    setReload(false);
    return () => {
      unsubscribe();
      unsubscribeAutreAbsence();
    };
  }, [reload]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadConges(true);
     
      const q = query(collection(db, 'conges'));

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
      setLoadConges(false);
    };

    fetchData();
    setReloadConges(false);
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
          {
            load || loadConges ? <Loader /> : (
              <Suspense fallback={<Loader />}>
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
                            nbre={nombreEmploye}
                          />
                          <CardDetalUser
                            icon={<Icon icon="solar:calendar-linear" fontSize={20} />}
                            text='Abscences totales'
                            nbre={nombreAbscence}
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
                        <Stack
                          direction='row'
                          sx={{
                            alignItems: 'center',
                            justifyContent: "space-between"
                          }}>

                          <Typography sx={{ fontSize: {xs: '18px', sm: '20px'}, fontWeight: "bold" }}>
                            Congés des employés
                          </Typography>
                          <NavLink to="/conges" style={{ textDecoration: 'none' }}>
                            <Typography sx={{ fontSize: {xs: '18px', sm: '16px'}, fontWeight: "bold", color: "#FF3F25" }}>
                              Voir plus
                            </Typography>
                          </NavLink>
                        </Stack>
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
                                position="home"
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

                      <Typography sx={{ fontSize: {xs: '18px', sm: '20px'}, fontWeight: "bold" }}>
                        Liste des employés
                      </Typography>
                      <NavLink to="/employes" style={{ textDecoration: 'none' }}>
                        <Typography sx={{ fontSize: {xs: '18px', sm: '16px'}, fontWeight: "bold", color: "#FF3F25" }}>
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
              </Suspense>
            )
          }

        </Box>

      </Box>

    </>
  );
}

export default Home;
