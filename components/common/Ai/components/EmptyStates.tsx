import React from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { AgenticSearchResponse, AIAlternative, SuggestedCategory } from "@/services/ai/aiInterface";
import { fadeUp, MIN_TOUCH } from "./motion";

interface Common {
  response: AgenticSearchResponse;
  onPickService: (a: AIAlternative) => void;
  onPickCategory: (c: { id: string; name: string; subcategoryId?: string }) => void;
  onChangeLocation: () => void;
  disabled?: boolean;
}

const chipSx = {
  minHeight: 36,
  fontWeight: 600,
  fontSize: "0.8rem",
  bgcolor: "background.paper",
  border: `1px solid ${COLORS.PURPLE_ALPHA_20}`,
  color: COLORS.PRIMARY_PURPLE,
} as const;

function CategoryChips({ cats, onPick, disabled }: { cats: SuggestedCategory[]; onPick: Common["onPickCategory"]; disabled?: boolean }) {
  if (!cats.length) return null;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
      {cats.map((c) => (
        <Chip key={c.id} label={c.name} clickable disabled={disabled} onClick={() => onPick({ id: c.id, name: c.name })} sx={chipSx} />
      ))}
    </Box>
  );
}

/** Vague / low-confidence query: ask, offer real options, never guess. */
export function ClarifyBlock({ response, onPickService, onPickCategory, disabled }: Common) {
  const alts = response.alternatives || [];
  const cats = ("suggestedCategories" in response && response.suggestedCategories) || [];
  return (
    <Box sx={{ ...fadeUp, mt: 1 }}>
      {alts.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {alts.map((a) => (
            <Chip key={a.key} label={a.label} clickable disabled={disabled} onClick={() => onPickService(a)} sx={chipSx} />
          ))}
        </Box>
      )}
      <CategoryChips cats={cats} onPick={onPickCategory} disabled={disabled} />
    </Box>
  );
}

/** Understood the ask but nothing relevant exists (or the ask isn't something we list). Always offers a next step. */
export function NoResultsBlock({ response, onPickService, onPickCategory, onChangeLocation, disabled }: Common) {
  const u = response.understanding;
  const explore = response.explore;
  const alts = response.alternatives || [];
  const cats = ("suggestedCategories" in response && response.suggestedCategories) || [];
  const elsewhere = response.elsewhereCount || 0;
  const unsupported = response.resultType === "unsupported";

  return (
    <Box sx={{ ...fadeUp, mt: 1, p: 1.5, borderRadius: 3, border: `1px dashed ${COLORS.PURPLE_ALPHA_30}`, bgcolor: "background.paper" }}>
      {elsewhere > 0 && (
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 1 }}>
          {elsewhere} matching {elsewhere === 1 ? "provider is" : "providers are"} in other cities.
        </Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {explore && (
          <Button
            variant="contained"
            disabled={disabled}
            onClick={() => onPickCategory({ id: explore.categoryId, name: explore.categoryName, subcategoryId: explore.subcategoryId })}
            sx={{ minHeight: MIN_TOUCH, textTransform: "none", fontWeight: 700, borderRadius: 2, bgcolor: COLORS.PRIMARY_PURPLE }}
          >
            Explore {explore.categoryName}
          </Button>
        )}
        {!unsupported && u?.conceptKey && (
          <Button variant="outlined" disabled={disabled} onClick={onChangeLocation} sx={{ minHeight: MIN_TOUCH, textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
            Search another location
          </Button>
        )}
      </Box>

      {alts.length > 0 && (
        <>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 1.5 }}>Related services</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.5 }}>
            {alts.map((a) => (
              <Chip key={a.key} label={a.label} clickable disabled={disabled} onClick={() => onPickService(a)} sx={chipSx} />
            ))}
          </Box>
        </>
      )}
      {cats.length > 0 && (
        <>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 1.5 }}>Browse what&apos;s available</Typography>
          <CategoryChips cats={cats} onPick={onPickCategory} disabled={disabled} />
        </>
      )}
    </Box>
  );
}
