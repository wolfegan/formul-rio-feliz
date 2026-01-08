-- Allow admins to delete simulations
CREATE POLICY "Admins can delete simulations"
ON public.insurance_simulations
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));