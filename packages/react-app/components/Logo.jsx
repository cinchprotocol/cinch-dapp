export function Logo(props) {
  return (
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <img class="h-12 w-12" src="/cinch_logo.png" alt="Cinch"></img>
        </div>
        <div class="hidden md:block">
          <span class="ml-1 text-600 text-4xl text-blue-600 font-semibold">
            Cinch
          </span>
        </div>
      </div>
    </div>
  )
}
