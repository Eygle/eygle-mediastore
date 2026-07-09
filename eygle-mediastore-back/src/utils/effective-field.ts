// Resolves each media_group to its "effective" field: its own field when set,
// otherwise the field of the closest ancestor having one (null when the whole
// parent chain is field-less). This way media stored in nested groups (e.g.
// sub-websites) are attributed to their root section.
export const EFFECTIVE_FIELD_CTE = `
WITH RECURSIVE ancestry AS (
    SELECT id AS group_id, field, parent_id
    FROM mediastore.media_group
  UNION ALL
    SELECT ancestry.group_id, parent.field, parent.parent_id
    FROM ancestry
    JOIN mediastore.media_group parent ON parent.id = ancestry.parent_id
    WHERE ancestry.field IS NULL
),
effective_field AS (
  SELECT group_id, field
  FROM ancestry
  WHERE field IS NOT NULL OR parent_id IS NULL
)`;
