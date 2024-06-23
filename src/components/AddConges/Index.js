import { Autocomplete, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography, styled } from '@mui/material'
import { DateField } from '@mui/x-date-pickers';
import { addDoc, collection, onSnapshot, query, } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebaseConfig';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { toast } from 'react-toastify';


const AddConges = () => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [load, setLoad] = useState(false);
  const [reload, setReload] = useState(false);
  const [totalDays, setTotalDays] = useState(0);

  const CustomPaper = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    '& .MuiAutocomplete-listbox': {
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#FF3F25',
        borderRadius: '8px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#FF5733',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#F0F0F0',
        borderRadius: '8px',
      },
    },
  }));

  useEffect(() => {

    const q = query(collection(db, "employes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newDocs = {};
      querySnapshot.forEach((doc) => {
        newDocs[doc.id] = doc.data();
      });
      setOptions(Object.values(newDocs));

    });
    setReload(false);
    return () => {
      unsubscribe();
    };
  }, [reload]);

  const AddcongeSchema = Yup.object().shape({
    employe: Yup.string()
      .required(`Veuillez saisir le nom de l'employe!`),
    typeAbscence: Yup.string()
      .required(`Veuillez selectionner le type d'abscence!`),
    motif: Yup.string()
      .required(`Veuillez selectionner le type d'abscence!`),
    dateDebut: Yup.string()
      .required(`Veuillez entrer une date!`),
    dateFin: Yup.string()
      .required(`Veuillez entrer une date!`),
  });

  const formik = useFormik({
    initialValues: {
      employe: null,
      typeAbscence: "",
      dateDebut: null,
      dateFin: null,
      motif: "",
      matricule: ""
    },

    validationSchema: AddcongeSchema,
    onSubmit: async (values) => {
      setLoad(true);
      try {
        if (values.dateDebut && values.dateFin) {
          const dateDebut = new Date(values.dateDebut);
          const dateFin = new Date(values.dateFin);

          if (dateFin < dateDebut) {
            toast.error("Erreur sur la date", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setLoad(false);
            return;
          }
        }
        await addDoc(collection(db, "conges"), {
          matricule: values.matricule,
          employe: values.employe,
          typeAbscence: values.typeAbscence,
          dateDebut: new Date(values.dateDebut),
          dateFin: new Date(values.dateFin),
          motif: values.motif,
        });
        toast.success("Enregistrer avec success", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoad(false);
        formik.handleReset();
        formik.setFieldValue('employe', null);
        setInputValue('');
        setSelectedEmployee(null);
      } catch (error) {
        setLoad(false);
      }


    },
  })
  useEffect(() => {
    if (formik.values.typeAbscence === "Congés payé") {
      formik.setValues((values) => ({
        ...values,
        motif: "RAS",
      }));
    } else {
      formik.setValues((values) => ({
        ...values,
        motif: "",
      }));
    }
  }, [formik.values.typeAbscence]);





  return (
    <Box
      onSubmit={formik.handleSubmit}
      component="form"
      noValidate
      autoComplete="off"
      display='flex'
      flexDirection='column'
      alignItems='center'
      gap={3}
      justifyContent='center'
      sx={{
        padding: '20px',
        mb: 10
      }}

    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <Typography>Employé</Typography>
            <Autocomplete
              value={selectedEmployee}
              options={options}
              getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
      
              onChange={(event, newValue) => {
                if (newValue) {
                  const formattedValue = `${newValue.nom} ${newValue.prenom}`;
                  formik.setFieldValue('employe', formattedValue); 
                  formik.setFieldValue('matricule', newValue.matricule); 
                  setInputValue(formattedValue); 
                  setSelectedEmployee(newValue);
                } else {
                  formik.setFieldValue('employe', null); 
                  setInputValue(''); 
                  setSelectedEmployee(null);
                }
              }}
              renderInput={(params) => <TextField {...params} placeholder="Nom de l'employé" />}
              PaperComponent={({ children }) => <CustomPaper>{children}</CustomPaper>}
            />
          </FormControl>
          {
            formik.touched.employe && formik.errors.employe && (
              <Typography style={{ color: 'red', fontSize: '13px' }}>
                {formik.errors.employe}
              </Typography>
            )
          }
        </div>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <Typography>Types d'abscences</Typography>
            <Select
              value={formik.values.typeAbscence}
              onChange={(event) => {
                formik.setFieldValue('typeAbscence', event.target.value);

              }}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Choisir</em>;
                }
                return selected;
              }}
            >
              <MenuItem value="" disabled>
                <em>Choisir</em>
              </MenuItem>
              <MenuItem value="Congés payé">Congés payé</MenuItem>
              <MenuItem value="Autre Abscence">Autre Abscence</MenuItem>
            </Select>
          </FormControl>
          {
            formik.touched.typeAbscence && formik.errors.typeAbscence && (
              <Typography style={{ color: 'red', fontSize: '13px' }}>
                {formik.errors.typeAbscence}
              </Typography>
            )
          }
        </div>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <Typography>Date de debut</Typography>
            <DateField
              // defaultValue={formik.values.time}
              value={formik.values.dateDebut}
              onChange={(date) => formik.setFieldValue('dateDebut', date)}
              fullWidth sx={{ background: 'white' }}
            />
          </FormControl>
          {
            formik.touched.dateDebut && formik.errors.dateDebut && (
              <Typography style={{ color: 'red', fontSize: '13px' }}>
                {formik.errors.dateDebut}
              </Typography>
            )
          }
        </div>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <Typography>Date de fin</Typography>
            <DateField
              value={formik.values.dateFin}
              onChange={(date) => formik.setFieldValue('dateFin', date)}
              fullWidth sx={{ background: 'white' }}
            />
          </FormControl>
          {
            formik.touched.dateFin && formik.errors.dateFin && (
              <Typography style={{ color: 'red', fontSize: '13px' }}>
                {formik.errors.dateFin}
              </Typography>
            )
          }
        </div>

      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          <Typography>Motif</Typography>
          <TextField
            // disabled={formik.values.typeAbscence === "Congés payé" ? true : false}
            InputProps={{
              readOnly: formik.values.typeAbscence === "Congés payé" ? true : false
            }}
            fullWidth
            sx={{
              backgroundColor: 'white',
              '& .Mui-disabled': {
                backgroundColor: '#f0f0f0',
                color: '#a0a0a0',
              },
            }}
            type='text'
            name="motif"
            id='motif'
            value={formik.values.motif}
            onChange={(e) => formik.setFieldValue('motif', e.target.value)}
            placeholder="Motif"
          />
          {
            formik.touched.motif && formik.errors.motif && (
              <Typography style={{ color: 'red', fontSize: '13px' }}>
                {formik.errors.motif}
              </Typography>
            )
          }
        </div>
        <div style={{ width: '100%' }}></div>
      </Stack>
      <>
        <Button
          variant='contained'
          disableElevation
          disabled={load}
          type='submit'
          sx={{
            backgroundColor: '#ce1212',
            padding: '8px 20px',
            '&:hover': {
              backgroundColor: '#ce1212',
            }
          }}
        >
          {
            !load ? 'Enregistrer' : <CircularProgress sx={{color: 'white'}} size={30} />
          }
        </Button>
      </>
    </Box>
  )
}

export default AddConges