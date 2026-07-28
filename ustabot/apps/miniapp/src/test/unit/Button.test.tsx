import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button.js";

describe("<Button />", () => {
  it("berilgan matnni ko'rsatadi", () => {
    render(<Button>Saqlash</Button>);
    expect(screen.getByText("Saqlash")).toBeInTheDocument();
  });

  it("bosilganda onClick chaqiriladi", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Yubor</Button>);

    fireEvent.click(screen.getByText("Yubor"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("isLoading=true bo'lsa disabled bo'ladi va onClick chaqirilmaydi", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Yuklanmoqda
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
