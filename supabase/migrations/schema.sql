CREATE TABLE public.habits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    complete_days text[] DEFAULT '{}',
    target_days int DEFAULT 40,
    created_at timestamp with time zone DEFAULT now()
);

-- ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow insert for all users"
--     ON public.habits
--     FOR INSERT
--     TO public
--     USING (true);

-- CREATE POLICY "Allow select for all users"
--     ON public.habits
--     FOR SELECT
--     TO public
--     USING (true);

-- CREATE POLICY "Allow update for all users"
--     ON public.habits
--     FOR UPDATE
--     TO public
--     USING (true);

-- CREATE POLICY "Allow delete for all users"
--     ON public.habits
--     FOR DELETE
--     TO public
--     USING (true);

-- INSERT INTO public.habits (title, description, complete_days, target_days) VALUES
-- ('Morning Exercise', '**Daily** 30 minutes of exercise to stay fit.', '{}', 40),
-- ('Reading', 'Read *at least* 20 pages every day.', '{"2025-01-11", "2025-01-10"}', 40);