export class StringUtil {
  public static id(prefix = ''): string {
    return (
      prefix +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    )
  }
}
