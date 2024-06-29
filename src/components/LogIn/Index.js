import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from "formik";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import * as Yup from 'yup';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LogIn = () => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string()
      .required(`Veuillez saisir le password!`).required('Required'),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);


  const formik = useFormik({

    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      console.log(values)
      setLoading(true);
      try {
        const response = await signInWithEmailAndPassword(auth, values.email, values.password);
        if (response) {
          console.log(response);
          setLoading(false);
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error('Error Code:', errorCode);
        console.error('Error Message:', errorMessage);
        if (navigator.onLine === false) {
          // Pas de connexion Internet
          toast.error(
            "Pas de connexion Internet. Veuillez vérifier votre connexion.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        } else if (errorCode === "auth/invalid-credential") {
          toast.warning(
            "Informations incorrectes.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        }
        else {
          toast.error("Une erreur s' est produite lors de la connexion", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

        }
      }
    }
  })

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #FF3F25 0%, #FF5733 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Paper
        onSubmit={formik.handleSubmit}
        component="form"
        sx={{
          width: '90%',
          maxWidth: '600px',
          backgroundColor: 'white',
          py: 4,
          my: 2,

        }}>
        <Typography sx={{ textAlign: 'center', fontSize: '45px' }}>Login</Typography>
        <Stack spacing={2} sx={{ px: 2, mt: 4, }}>
          <div>

            <TextField
              fullWidth
              type='text'
              placeholder="email"
              value={formik.values.email}
              onChange={(e) => formik.setFieldValue('email', e.target.value)}
            />
            {
              formik.touched.email && formik.errors.email && (
                <Typography style={{ color: 'red', fontSize: '13px' }}>
                  {formik.errors.email}
                </Typography>
              )
            }

          </div>
          <div>
            <TextField
              fullWidth
              type='password'
              placeholder="password"
              autoComplete='false'
              value={formik.values.password}
              onChange={(e) => formik.setFieldValue('password', e.target.value)}
            />
            {
              formik.touched.password && formik.errors.password && (
                <Typography style={{ color: 'red', fontSize: '13px' }}>
                  {formik.errors.password}
                </Typography>
              )
            }
          </div>
          <Typography sx={{ textAlign: 'right' }}>
            Mot de passe oublie
          </Typography>
          <Button disabled={loading} variant="contained" type='submit'>
            {
              !loading ? 'Login' : <CircularProgress sx={{ color: 'white' }} size={30} />
            }
          </Button>
        </Stack>

      </Paper>

    </Box>
  )
}

export default LogIn
