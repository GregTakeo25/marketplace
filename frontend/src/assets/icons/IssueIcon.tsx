interface LoaderProps {
  className?: string;
  size?: number;
}

export default function IssueIcon({ className, size = 12 }: LoaderProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" height={size} width={size}>
      <path
        d="M8.17574 4.90968C8.17788 5.03112 8.13281 5.14865 8.05001 5.23751L5.86251 7.42501C5.77461 7.51279 5.65547 7.56209 5.53126 7.56209C5.40704 7.56209 5.2879 7.51279 5.20001 7.42501L3.95001 6.17501C3.86721 6.08615 3.82213 5.96862 3.82427 5.84718C3.82641 5.72574 3.87561 5.60988 3.96149 5.52399C4.04738 5.43811 4.16324 5.38891 4.28468 5.38677C4.40612 5.38463 4.52365 5.42971 4.61251 5.51251L5.53126 6.43126L7.38751 4.57501C7.47637 4.49221 7.59389 4.44713 7.71533 4.44927C7.83677 4.45141 7.95264 4.50061 8.03852 4.58649C8.1244 4.67238 8.1736 4.78824 8.17574 4.90968Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53553 9.53553C10.4732 8.59785 11 7.32608 11 6C11 4.67392 10.4732 3.40215 9.53553 2.46447C8.59785 1.52678 7.32608 1 6 1C4.67392 1 3.40215 1.52678 2.46447 2.46447C1.52678 3.40215 1 4.67392 1 6C1 7.32608 1.52678 8.59785 2.46447 9.53553C3.40215 10.4732 4.67392 11 6 11C7.32608 11 8.59785 10.4732 9.53553 9.53553ZM8.87262 3.12738C9.63449 3.88925 10.0625 4.92256 10.0625 6C10.0625 7.07744 9.63449 8.11075 8.87262 8.87262C8.11075 9.63449 7.07744 10.0625 6 10.0625C4.92256 10.0625 3.88925 9.63449 3.12738 8.87262C2.36551 8.11075 1.9375 7.07744 1.9375 6C1.9375 4.92256 2.36551 3.88925 3.12738 3.12738C3.88925 2.36551 4.92256 1.9375 6 1.9375C7.07744 1.9375 8.11075 2.36551 8.87262 3.12738Z"
        fill="currentColor"
      />
    </svg>
  );
}