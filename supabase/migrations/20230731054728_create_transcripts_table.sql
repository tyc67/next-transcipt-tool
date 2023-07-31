create table "public"."transcript" (
    "id" uuid not null default gen_random_uuid(),
    "parent_transcript_id" text not null,
    "path" text not null,
    "checksum" text,
    "meta" jsonb,
    "type" text,
    "source" text,
    "created_at" timestamp with time zone default now(),
    "symbol" text not null,
    "heading" text not null,
    "content" text not null,
    "company_name" text not null
);


create table "public"."transcript_section" (
    "id" uuid not null default gen_random_uuid(),
    "parent_transcript_id" text not null,
    "symbol" text not null,
    "quarter" text not null,
    "year" text not null,
    "heading" text,
    "content" text,
    "embedding" vector(1536),
    "beat_market" boolean,
    "token_count" text
);


CREATE UNIQUE INDEX transcript_parent_id ON public.transcript USING btree (parent_transcript_id);

CREATE UNIQUE INDEX transcript_pkey ON public.transcript USING btree (id);

CREATE UNIQUE INDEX transcripts_pkey ON public.transcript_section USING btree (id);

alter table "public"."transcript" add constraint "transcript_pkey" PRIMARY KEY using index "transcript_pkey";

alter table "public"."transcript_section" add constraint "transcripts_pkey" PRIMARY KEY using index "transcripts_pkey";

alter table "public"."transcript" add constraint "transcript_parent_id" UNIQUE using index "transcript_parent_id";

alter table "public"."transcript_section" add constraint "transcript_section_parent_transcript_id_fkey" FOREIGN KEY (parent_transcript_id) REFERENCES transcript(parent_transcript_id) ON DELETE CASCADE not valid;

alter table "public"."transcript_section" validate constraint "transcript_section_parent_transcript_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.match_transcript_section(embedding vector, match_threshold double precision, match_count integer, min_content_length integer, match_transcriptid text)
 RETURNS TABLE(id uuid, parent_transcript_id text, content text, similarity double precision)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_variable
begin
  return query
  select
    transcript_section.id,
    transcript_section.parent_transcript_id,
    transcript_section.content,
    (transcript_section.embedding <#> embedding) * -1 as similarity
  from transcript_section
  
  -- selected transcript have to be matched
  where transcript_section.parent_transcript_id = match_transcriptId
  -- The sections should have a useful amount of content
  and length(transcript_section.content) >= min_content_length
  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (transcript_section.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by transcript_section.embedding <#> embedding
  
  limit match_count;
end;
$function$
;


