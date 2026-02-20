{
  description = "A flake for the development of Apsis";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells.${system} = {
      default = pkgs.mkShell {
        packages = [
          pkgs.nodejs_25
          pkgs.fish
        ];

        shellHook = ''exec fish'';
      };
    };
  };
}
