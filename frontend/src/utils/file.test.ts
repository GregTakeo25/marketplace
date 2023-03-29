import { describe } from "vitest";
import { formatSize } from "./file";

describe("File", () => {
  it("should format in human readable size", () => {
    expect(formatSize(123.45)).toBe("123.5 B");
    expect(formatSize(123.0)).toBe("123 B");
    expect(formatSize(12345)).toBe("12.3 kB");
    expect(formatSize(12345000)).toBe("12.3 MB");
    expect(formatSize(12345000000)).toBe("12.3 GB");
    expect(formatSize(12345000000000)).toBe("12.3 TB");
    expect(formatSize(12355000000)).toBe("12.4 GB");
  });
});
