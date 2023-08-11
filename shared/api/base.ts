interface Option<RequestPayload, ResponsePayload> {
  server: (req: RequestPayload) => Promise<ResponsePayload>
  client: (req: RequestPayload) => Promise<ResponsePayload>
}
const createApi = <RequestPayload = unknown, ResponsePayload = unknown>(
  option: Option<RequestPayload, ResponsePayload>
) => option

// typescript connect api client and server side (ex. zod,trpc library)

// const api1ReqSchema = z.objcect({})

// export const api1 = createApi<z.infer<typeof api1ReqSchema>, {ok:boolean; message: string}>({
//   client: (data) => {
//     api1ReqSchema.parse(data)
//   },
//   server: () => {},
// })
