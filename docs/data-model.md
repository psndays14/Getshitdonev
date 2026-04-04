# Modèle de données — MVP ZAF BAT

## Entités

## 1) lead
- `id` (uuid)
- `full_name` (string)
- `profile_type` (enum: `HNWI_MA`, `MRE`)
- `source` (enum: `REFERRAL`, `EVENT`, `DIGITAL`, `PARTNER`)
- `phone` (string)
- `email` (string)
- `interest_city` (string)
- `estimated_budget_mad` (number)
- `status` (enum: `NEW`, `CONTACTED`, `MEETING_SET`, `CONVERTED`, `LOST`)
- `owner_user_id` (uuid)
- `created_at`, `updated_at`

## 2) qualification
- `id` (uuid)
- `lead_id` (fk -> lead.id)
- `budget_score` (int 0-25)
- `intent_score` (int 0-25)
- `timeline_score` (int 0-25)
- `solvency_score` (int 0-25)
- `total_score` (int 0-100)
- `priority` (enum: `HIGH`, `MEDIUM`, `LOW`)
- `decision` (enum: `PROCESS`, `NURTURE`, `DROP`)
- `notes` (text)
- `created_at`

## 3) project
- `id` (uuid)
- `lead_id` (fk -> lead.id)
- `project_code` (string unique)
- `title` (string)
- `city` (string)
- `estimated_value_mad` (number)
- `stage` (enum: `PLANNING`, `IN_PROGRESS`, `BLOCKED`, `DELIVERED`)
- `project_manager_user_id` (uuid)
- `start_date`, `target_delivery_date`
- `created_at`, `updated_at`

## 4) weekly_report
- `id` (uuid)
- `week_start_date` (date)
- `week_end_date` (date)
- `new_leads_count` (int)
- `converted_leads_count` (int)
- `active_projects_count` (int)
- `blocked_projects_count` (int)
- `revenue_pipeline_mad` (number)
- `generated_by_user_id` (uuid)
- `created_at`

## 5) generated_document
- `id` (uuid)
- `entity_type` (enum: `LEAD`, `PROJECT`, `REPORT`)
- `entity_id` (uuid)
- `template_key` (string)
- `file_url` (string)
- `version` (int)
- `created_by_user_id` (uuid)
- `created_at`

## Relations clés
- `lead 1--1 qualification` (au minimum la dernière qualification active)
- `lead 1--n project` (un lead peut déboucher sur plusieurs projets)
- `weekly_report` agrège `lead` et `project`
- `generated_document` est polymorphe via (`entity_type`, `entity_id`)
