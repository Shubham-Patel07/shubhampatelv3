import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StackIcon } from "@/components/ui/stack-icon";
import { stackGroups } from "@/lib/data/stack";
import { techIcons } from "@/lib/data/tech-icons";

/**
 * The Toolkit on /about renders every item in `stackGroups` with a glyph. Both
 * halves of that are silent when they break: `TechLogo` returns null for an
 * unknown key, and `StackIcon` returns null for an unmapped name — so an item
 * added to `lib/data/stack.ts`, or renamed there, degrades to bare text that
 * nobody notices until the column looks broken in a screenshot.
 *
 * Rendered rather than asserted against the maps directly, because the maps
 * aren't exported and the thing worth pinning is the output.
 */

const items = stackGroups.flatMap((group) =>
  group.items.map((item) => [group.label, item] as const),
);

describe("StackIcon", () => {
  it.each(items)("renders a glyph for %s › %s", (_group, item) => {
    expect(renderToStaticMarkup(<StackIcon name={item} />)).toContain("<svg");
  });

  it("covers the whole stack, so the count can't quietly drift", () => {
    const withGlyph = items.filter(([, item]) =>
      renderToStaticMarkup(<StackIcon name={item} />).includes("<svg"),
    );
    expect(withGlyph.length).toBe(items.length);
  });

  it("renders nothing for an unknown name rather than a placeholder box", () => {
    expect(renderToStaticMarkup(<StackIcon name="Fortran" />)).toBe("");
  });

  it.each([
    ["Bash", "bash", "GNU Bash"],
    ["GitLab CI", "gitlab", "GitLab"],
    ["ELK / Kibana", "elasticstack", "Elastic Stack"],
  ])(
    "maps %s to the %s mark and not a lookalike",
    (item, key, expectedTitle) => {
      // A wrong-but-present mark is the failure this catches: every one of these
      // renders *an* icon either way, so "a glyph appeared" isn't enough. The
      // title comes from the generator, so it also pins which vendor mark it is.
      expect(techIcons[key].title).toBe(expectedTitle);
      expect(renderToStaticMarkup(<StackIcon name={item} />)).toContain(
        techIcons[key].path,
      );
    },
  );

  it("keeps concept glyphs a size above the brand marks", () => {
    // Stroked lucide outlines carry less ink than filled brand marks and read a
    // size smaller at identical dimensions — the compensation documented in
    // docs/ROADMAP.md. Dropping it is a visual regression no snapshot catches.
    const concept = renderToStaticMarkup(<StackIcon name="Microservices" />);
    const brand = renderToStaticMarkup(<StackIcon name="Docker" />);

    expect(concept).toContain("size-[1.0625rem]");
    expect(brand).toContain("h-4");
  });
});
