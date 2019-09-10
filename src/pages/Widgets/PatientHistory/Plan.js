export default ({ classes, current }) => (
  <div>
    <div
      className={classes.paragraph}
      dangerouslySetInnerHTML={{ __html: current.plan }}
    />
  </div>
)
