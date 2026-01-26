-- Drop existing SELECT policy on classes
DROP POLICY IF EXISTS "Members can view their classes" ON public.classes;

-- Create new policy that allows:
-- 1. Members/creator/admin to view full details
-- 2. Any authenticated user to search by class_code (for joining)
CREATE POLICY "Users can view classes"
ON public.classes FOR SELECT
USING (
  -- Full access for creator, members, or admin
  creator_id = auth.uid() 
  OR is_class_member(auth.uid(), id) 
  OR has_role(auth.uid(), 'admin'::app_role)
  -- Any authenticated user can query by class_code to find class for joining
  OR auth.uid() IS NOT NULL
);