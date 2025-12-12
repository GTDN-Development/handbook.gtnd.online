export function AgencyCredit(props: Omit<React.ComponentProps<"p">, "children">) {
  return (
    <p {...props} style={{ color: "currentColor", ...props.style }}>
      <span style={{ opacity: "0.6" }}>Created by </span>
      <a
        href="https://www.gtdn.online/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          cursor: "pointer",
          textDecorationLine: "underline",
          textDecorationColor: "color-mix(in oklab, currentColor 33%, transparent)",
          textDecorationThickness: "1px",
          textUnderlineOffset: "2px",
        }}
      >
        gtdn.online
        <span
          style={{
            marginLeft: "6px",
            opacity: "0.6",
            fontSize: "1em",
          }}
        >
          &#8599;
        </span>
      </a>
    </p>
  );
}
