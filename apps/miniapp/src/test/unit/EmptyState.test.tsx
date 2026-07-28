import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "@/components/common/EmptyState.js";

describe("<EmptyState />", () => {
  it("title va description'ni ko'rsatadi", () => {
    render(<EmptyState title="Hech narsa topilmadi" description="Boshqa so'z bilan urinib ko'ring" />);

    expect(screen.getByText("Hech narsa topilmadi")).toBeInTheDocument();
    expect(screen.getByText("Boshqa so'z bilan urinib ko'ring")).toBeInTheDocument();
  });

  it("action tugmasi bosilganda onAction chaqiriladi", () => {
    const onAction = vi.fn();
    render(<EmptyState title="Bo'sh" actionLabel="Qayta urinish" onAction={onAction} />);

    fireEvent.click(screen.getByText("Qayta urinish"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("actionLabel berilmasa tugma ko'rsatilmaydi", () => {
    render(<EmptyState title="Bo'sh" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
