export function Logo(props) {
  return (
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <img class="h-10 w-10" src="/cinch_logo.png" alt="Cinch"></img>
        </div>
        <div class="hidden md:block">
          <span class="ml-2 text-600 text-3xl text-blue-600 font-semibold">
            Cinch
          </span>
        </div>
      </div>
    </div>
  )
}
